/**
 * Hybrid chat engine:
 * 1) Offline WebLLM (Llama 3.2 1B) when ready
 * 2) Fast knowledge-base fallback (always available)
 */

import {
  FAQ_INTENTS,
  COMPANY_FACTS,
  getProductKnowledge,
  retrieveRelevantProducts,
  retrieveRelevantNotes,
  buildSystemPrompt,
  buildProductCountAnswer,
  COMMON_STOPWORDS,
} from '../data/chatKnowledge'
import { getApplicationNotes } from '../data/applicationNotes'
import { retrieveRelevantFaq } from '../data/technicalFaq'
import {
  ensureOfflineLlm,
  getOfflineLlmStatus,
  isWebGpuAvailable,
  streamOfflineChat,
} from './offlineLlm'

/**
 * Lazy-load the extracted PDF corpus + retrieval only when a visitor chats,
 * so the ~180 KB of note text stays out of the initial page bundle.
 */
let pdfRetrievalPromise = null
async function getNoteExcerpts(query, k = 3) {
  try {
    if (!pdfRetrievalPromise) {
      pdfRetrievalPromise = import('../data/pdfRetrieval')
    }
    const { retrieveNoteExcerpts } = await pdfRetrievalPromise
    return retrieveNoteExcerpts(query, k)
  } catch {
    return []
  }
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[μµ]/g, 'u')
    .replace(/[^a-z0-9\s./+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1)
}

function scoreProduct(query, product) {
  const q = normalize(query)
  const tokens = tokenize(query)
  const hay = product.keywords
  // Whole-word set avoids false positives like "are" ⊂ "software".
  const words = new Set(hay.split(/[^a-z0-9+]+/))
  let score = 0

  if (q.includes(normalize(product.name))) score += 14
  if (q.includes(normalize(product.slug.replace(/-/g, ' ')))) score += 10

  tokens.forEach((t) => {
    if (t.length < 3 || COMMON_STOPWORDS.has(t)) return
    if (words.has(t)) score += 2
  })

  if (/meso/.test(q) && /mesoprobe/.test(hay)) score += 8
  if (/(uprobe|uprobes|micro.?probe|μprobe)/.test(q) && /uprobe/.test(product.slug)) score += 8
  if (/\bng\s?50\b|\bng50\b|nanoguru/.test(q) && product.slug === 'ng50') score += 8
  if (/\bng\s?80\b|\bng80\b/.test(q) && product.slug === 'ng80') score += 8
  if (/\bti\s?980\b/.test(q) && /ti-980/.test(product.slug)) score += 8
  if (/\bpi\s?89\b/.test(q) && /pi-89/.test(product.slug)) score += 8
  if (/\bpi\s?95\b/.test(q) && /pi-95/.test(product.slug)) score += 8
  if (/biosoft/.test(q) && /biosoft/.test(product.slug)) score += 8

  return score
}

function formatProductAnswer(product) {
  const badges = product.badges?.length ? `\n\n**Highlights:** ${product.badges.join(' · ')}` : ''
  const lead = product.lead ? `\n\n${product.lead}` : ''
  return (
    `**${product.name}** (${product.category})\n\n` +
    `${product.shortDesc}` +
    lead +
    badges +
    `\n\n→ Product page: [${product.path}](${product.path})\n` +
    `→ Brochure: [/brochure-form?product=${product.slug}](/brochure-form?product=${product.slug})\n\n` +
    `Ask me about specs, applications, or how it compares to another instrument.`
  )
}

function matchFaq(query, products) {
  const q = normalize(query)
  for (const intent of FAQ_INTENTS) {
    if (intent.patterns.some((re) => re.test(q))) {
      return intent.answer({ products, company: COMPANY_FACTS })
    }
  }
  return null
}

function formatNoteLinks(notes) {
  return notes
    .map(
      (n) =>
        `• [${n.label}](${n.pdf})${n.industries?.length ? ` — ${n.industries.join(', ')}` : ''}`,
    )
    .join('\n')
}

function notesReply(notes, { all = false } = {}) {
  const head = all
    ? `Industron has **${notes.length} downloadable application notes** (PDFs):`
    : `Here ${notes.length === 1 ? 'is a relevant application note' : 'are the most relevant application notes'} (PDF):`
  return `${head}\n\n${formatNoteLinks(notes)}\n\nBrowse them all on [/applications](/applications).`
}

/** Detect application-note / PDF questions and answer with real links. */
function matchApplicationNotes(query) {
  const q = normalize(query)
  const explicitNotes = /(application note|app ?note|case stud|white ?paper)/.test(q)
  const genericDoc = /\bpdf\b|\bpdfs\b|download|whitepaper|\bpaper\b|\breport\b|\bdocument\b/.test(q)
  const wantsAll = /\b(list|all|every|full|entire|show|see|which|what)\b/.test(q)

  if (explicitNotes && wantsAll) {
    return notesReply(getApplicationNotes(), { all: true })
  }

  const matches = retrieveRelevantNotes(query, 6)
  if (matches.length && (explicitNotes || genericDoc)) {
    return notesReply(matches)
  }
  if (explicitNotes) {
    return notesReply(getApplicationNotes(), { all: true })
  }
  return null
}

function compareProducts(query, products) {
  if (!/compar|vs\.?|versus|difference|better|between/.test(normalize(query))) return null
  const ranked = products
    .map((p) => ({ p, s: scoreProduct(query, p) }))
    .filter((x) => x.s >= 6)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2)
  if (ranked.length < 2) return null
  const [a, b] = ranked.map((x) => x.p)
  return (
    `Here's a quick comparison:\n\n` +
    `**${a.name}** — ${a.shortDesc}\n\n` +
    `**${b.name}** — ${b.shortDesc}\n\n` +
    `Both serve ${a.category === b.category ? `the **${a.category}** category` : `different categories (**${a.category}** vs **${b.category}**)`}. ` +
    `I can go deeper on either one, or connect you with sales for a recommendation based on your samples.`
  )
}

function fallback(query, products) {
  const ranked = products
    .map((p) => ({ p, s: scoreProduct(query, p) }))
    .sort((a, b) => b.s - a.s)

  if (ranked[0]?.s >= 6) return formatProductAnswer(ranked[0].p)

  const top = ranked.slice(0, 3).map((x) => x.p.name)
  return (
    `I'm not fully sure what you need yet — but I can help with Industron products, NRL testing, services, and contact paths.\n\n` +
    `Try asking about **${top.join('**, **')}**, or say *“Show me your products”* / *“How do I get material tested?”*.\n\n` +
    `For a human specialist: [${COMPANY_FACTS.contact.path}](${COMPANY_FACTS.contact.path}) · ${COMPANY_FACTS.contact.email}`
  )
}

export function generateChatReply(userMessage) {
  const products = getProductKnowledge()
  const q = normalize(userMessage)

  if (!q) {
    return {
      text: `Ask me anything about Industron instruments, testing, or support.`,
      suggestions: ['What is MesoProbe?', 'Show me your products', 'How can I contact sales?'],
      mode: 'knowledge',
    }
  }

  const comparison = compareProducts(userMessage, products)
  if (comparison) {
    return {
      text: comparison,
      suggestions: ['Contact sales', 'NRL testing', 'Show me your products'],
      mode: 'knowledge',
    }
  }

  const ranked = products
    .map((p) => ({ p, s: scoreProduct(userMessage, p) }))
    .sort((a, b) => b.s - a.s)

  if (ranked[0]?.s >= 8) {
    return {
      text: formatProductAnswer(ranked[0].p),
      suggestions: ['Compare with another product', 'Get brochure', 'Contact sales'],
      mode: 'knowledge',
    }
  }

  const notes = matchApplicationNotes(userMessage)
  if (notes) {
    return {
      text: notes,
      suggestions: ['Show all application notes', 'NRL testing', 'View /applications', 'Contact'],
      mode: 'knowledge',
    }
  }

  const faq = matchFaq(userMessage, products)
  if (faq) {
    return {
      text: faq,
      suggestions: ['What is MesoProbe?', 'μProbe 500', 'NRL testing', 'Contact'],
      mode: 'knowledge',
    }
  }

  const techFaq = retrieveRelevantFaq(userMessage, 1)
  if (techFaq.length) {
    return {
      text: `**${techFaq[0].question}**\n\n${techFaq[0].answer}`,
      suggestions: ['Tip selection guide', 'What is dynamic nanoindentation?', 'NRL testing', 'Contact'],
      mode: 'knowledge',
    }
  }

  return {
    text: fallback(userMessage, products),
    suggestions: ['MesoProbe', 'μProbe 500', 'NG80', 'Get material tested'],
    mode: 'knowledge',
  }
}

function suggestionsFor(text) {
  const t = normalize(text)
  if (/test|nrl|sample/.test(t)) return ['Open testing form', 'Services', 'Contact']
  if (/brochure|pdf|spec/.test(t)) return ['Get brochure', 'Products', 'Contact sales']
  if (/contact|sales|demo|quote/.test(t)) return ['Contact page', 'Brochure', 'NRL testing']
  return ['MesoProbe', 'μProbe 500', 'Show products', 'Contact']
}

/**
 * Prefer offline LLM when ready; otherwise knowledge engine.
 * Supports streaming via onToken.
 */
/** Queries we answer exactly from data (never let the model guess counts/lists). */
function deterministicAnswer(userMessage) {
  const q = normalize(userMessage)
  const mentionsCatalog = /product|instrument|model|machine|device|catalog|portfolio/.test(q)
  const isCount = /(how many|number of|count of|total (number )?of|how much)/.test(q)
  const isListAll = /(list|show|see|view|all|every|entire|full).*(product|instrument|catalog|portfolio)/.test(q)

  if (mentionsCatalog && (isCount || isListAll)) {
    return {
      text: buildProductCountAnswer(),
      suggestions: ['Tell me about MesoProbe', 'μProbe 500', 'NG80', 'Contact sales'],
      mode: 'knowledge',
    }
  }

  // Only short-circuit enumeration ("list/show all notes"); let content
  // questions ("what does the steel note find?") flow to the LLM + excerpts.
  const explicitNotes = /(application note|app ?note|case stud|white ?paper)/.test(q)
  const enumerate = /\b(list|all|every|full|entire|show|see|which|available)\b/.test(q)
  const haveNotes = /(do you have|what.*(note|pdf)|which.*(note|pdf)|any (note|pdf|case stud))/.test(q)
  if ((explicitNotes && enumerate) || haveNotes) {
    return {
      text: notesReply(getApplicationNotes(), { all: true }),
      suggestions: ['Explain the steel wear note', 'Contact-lens findings', 'NRL testing', 'View /applications'],
      mode: 'knowledge',
    }
  }
  return null
}

/**
 * Reveal a knowledge-base reply progressively through `onToken`, so instant
 * answers get the same typing animation as the streamed model replies.
 */
async function streamText(text, onToken, signal) {
  if (!onToken) return
  // Reveal in small bursts (~similar cadence to the model's token stream).
  const chunk = Math.max(1, Math.ceil(text.length / 180))
  let shown = ''
  for (let i = 0; i < text.length; i += chunk) {
    if (signal?.aborted) break
    shown = text.slice(0, i + chunk)
    onToken(shown)
    await new Promise((resolve) => setTimeout(resolve, 12))
  }
  onToken(text)
}

export async function answerWithBestEngine(userMessage, history = [], { onToken, preferLlm = true, signal } = {}) {
  const exact = deterministicAnswer(userMessage)
  if (exact) {
    await streamText(exact.text, onToken, signal)
    return exact
  }

  const status = getOfflineLlmStatus()

  // Instant-first: only use the enhanced engine when it is ALREADY loaded.
  // We never block a reply on the model download — the knowledge base answers
  // immediately, and the enhanced engine simply takes over once it's ready.
  if (preferLlm && status.ready) {
    try {
      const relevant = retrieveRelevantProducts(userMessage, 2)
      const noteExcerpts = await getNoteExcerpts(userMessage, 2)
      const system = buildSystemPrompt(relevant, userMessage, noteExcerpts)
      // Keep only the last few turns, and cap each so a long prior answer
      // can't push the prompt past the model's context window.
      const recent = history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-4)
        .map((m) => ({ role: m.role, content: String(m.text || '').slice(0, 500) }))

      const messages = [
        { role: 'system', content: system },
        ...recent,
        { role: 'user', content: userMessage },
      ]

      let full = ''
      for await (const delta of streamOfflineChat(messages, { signal, maxTokens: 420 })) {
        full += delta
        onToken?.(full)
      }

      const text = full.trim()
      if (text) {
        return { text, suggestions: suggestionsFor(userMessage), mode: 'llm' }
      }
      // Empty stream — fall through to the instant knowledge reply below.
    } catch {
      // Any streaming error — fall through silently to the instant reply.
    }
  } else if (preferLlm && isWebGpuAvailable()) {
    // Warm the enhanced engine up in the background so it can take over on a
    // later message. Fire-and-forget — this never delays the current answer.
    ensureOfflineLlm().catch(() => {})
  }

  const reply = generateChatReply(userMessage)
  await streamText(reply.text, onToken, signal)
  return reply
}

export function getWelcomeMessage() {
  return {
    text:
      `Hi — welcome to **Industron Support**.\n\n` +
      `I can help with products, material testing, brochures, services, and how to reach our team.`,
    suggestions: [
      'What is MesoProbe?',
      'Tell me about μProbe 500',
      'How do I get my material tested?',
      'Show me your products',
    ],
  }
}
