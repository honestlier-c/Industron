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
  isNanotechQuery,
  wantsInstrumentAdvice,
  COMMON_STOPWORDS,
} from '../data/chatKnowledge'
import { retrieveRelevantFaq } from '../data/technicalFaq'
import {
  getOfflineLlmStatus,
  scheduleOfflineLlmWarmup,
  shouldAutoLoadModel,
  streamOfflineChat,
} from './offlineLlm'

/**
 * Lazy-load the extracted PDF corpus + retrieval only when a visitor chats,
 * so the ~180 KB of note text stays out of the initial page bundle.
 */
let pdfRetrievalPromise = null
async function getNoteExcerpts(query, k = 3, opts = {}) {
  try {
    if (!pdfRetrievalPromise) {
      pdfRetrievalPromise = import('../data/pdfRetrieval')
    }
    const { retrieveNoteExcerpts } = await pdfRetrievalPromise
    return retrieveNoteExcerpts(query, k, opts)
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
  if (/\bng\s?80\b|\bng80\b/.test(q) && product.slug === 'ng80') score += 8
  if (/pneumatic|isolation table|air isolation/.test(q) && /pneumatic/.test(product.slug)) score += 8
  if (/\bdic\b|digital image correlation|strain map/.test(q) && /dic/.test(product.slug)) score += 8
  if (/biosoft/.test(q) && /biosoft/.test(product.slug)) score += 8

  return score
}

function formatProductAnswer(product) {
  const lead = product.lead ? ` ${product.lead}` : ''
  const highlights = product.badges?.length
    ? `\n\nWhat stands out: ${product.badges.slice(0, 3).join(' · ')}.`
    : ''
  const next = product.external
    ? `See details on [Bruker](${product.externalUrl}), or ask me how it compares to another system.`
    : `More on the [${product.name} page](${product.path}), or request a [brochure](/brochure-form?product=${product.slug}).`
  return (
    `**${product.name}** is Industron’s ${product.category.toLowerCase()} platform — ${product.shortDesc}${lead}` +
    highlights +
    `\n\n${next}`
  )
}

/**
 * Soft product CTA — only when the user asks for instruments / recommendations.
 * Pure technical questions stay technical only.
 */
function promoLineFor(query) {
  if (!wantsInstrumentAdvice(query)) return ''
  const q = normalize(query)
  if (/meso|dic|strain map|compress|bend|tensile|fatigue|hydrogel|foam/.test(q)) {
    return `For that measurement class, **MesoProbe** is Industron’s meso-scale platform with DIC — [/products/mesoprobe](/products/mesoprobe).`
  }
  if (/spm|afm|nanowear|high.?speed|hsi|site.?specific|ng80|nanoindent/.test(q)) {
    return `For nanoindentation with in-situ SPM / high-speed mapping, look at **NG80** — [/products/ng80](/products/ng80).`
  }
  if (/micro.?indent|uprobe|μprobe|500 mN/.test(q)) {
    return `For research-grade microindentation, **μProbe 500** — [/products/uprobe-500](/products/uprobe-500).`
  }
  if (/vibration|isolation|pneumatic|air table/.test(q)) {
    return `For floor vibration control: **Pneumatic Air Isolation Table** — [/products/pneumatic-air-isolation-table](/products/pneumatic-air-isolation-table).`
  }
  if (/soft|bio|lens|cell|tissue|cartilage/.test(q)) {
    return `For soft / bio samples, Industron’s **BioSoft** / meso platforms are the usual fit — [/products](/products).`
  }
  return `Industron’s main platforms here are **NG80**, **μProbe 500**, and **MesoProbe** — [/products](/products).`
}

function isJunkChunk(text) {
  const t = String(text || '').toLowerCase()
  return (
    /library of congress|cataloging in publication|isbn\s*0-?\d|john wiley|all rights reserved|copyright\s*\/?c|permission in writing of the publisher|british library cataloguing|printed and bound in|integras\/kcg\/pagination|typeset in|acid-free paper/.test(
      t,
    ) ||
    (/contributor|chapter authors|preface|contents list/.test(t) && !/what is nanotechnology/.test(t))
  )
}

/** Instant knowledge answer from book / note corpus when the LLM is still loading. */
function formatCorpusTutorAnswer(query, excerpts) {
  if (!excerpts?.length) return null
  const usableList = excerpts.filter((e) => !isJunkChunk(e.text))
  if (!usableList.length) return null

  const primary = usableList[0]
  let body = String(primary.text || '')
    .replace(/\/\/INTEGRAS\/[^\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Prefer the real definition sentence when present.
  const def = body.match(/nanotechnology is the term used to cover[^.]{20,280}\./i)
  if (def) body = def[0]
  else {
    const parts = body.split(/(?<=[.!?])\s+/).filter(Boolean)
    body = parts.slice(0, 3).join(' ')
    if (body.length > 420) body = `${body.slice(0, 417).trim()}…`
  }

  const extra = usableList
    .slice(1, 3)
    .map((e) => {
      const t = String(e.text || '')
        .replace(/\s+/g, ' ')
        .trim()
      const sentence = t.split(/(?<=[.!?])\s+/).filter(Boolean)[0] || ''
      return sentence.length > 40 ? sentence.slice(0, 180) : ''
    })
    .filter(Boolean)

  const core = [body, ...extra].filter(Boolean).join('\n\n')
  const sourceTitles = [...new Set(usableList.slice(0, 3).map((e) => e.title).filter(Boolean))]
  const cite =
    primary.public && primary.pdf
      ? `\n\nRelated note: [${primary.title}](${primary.pdf}).`
      : sourceTitles.length
        ? `\n\n_(Drawn from: ${sourceTitles.join('; ')})_`
        : ''
  const promo = promoLineFor(query)
  return promo ? `${core}${cite}\n\n${promo}` : `${core}${cite}`
}

/** Company / sales / catalog questions — skip book-corpus dumps. */
function isSiteOnlyQuery(query) {
  const q = normalize(query)
  return (
    /^(hi|hello|hey|thanks|thank you|ok|okay)\b/.test(q) ||
    /contact|email|phone|call sales|brochure|demo|quote|price|cost|founder|office|address|technopark|kinfra|how many product|list (all |your )?products|show (me )?(your )?products|get in touch|who (founded|owns)|team\b|staff\b/.test(
      q,
    )
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

/** Crisp professor-style wrap for technical FAQ entries. */
function formatTechFaqAnswer(entry, query) {
  const q = normalize(query)
  if (/hard (surface|material)|steel|ceramic|glass|bulk metal/.test(q) && /tip|probe|indenter/.test(q)) {
    return (
      `For a **hard surface**, use a **Berkovich** tip — the standard choice for hardness and modulus on metals, ceramics, and glass.\n\n` +
      `Included angle **142.35°**, tip radius typically **~120–150 nm**.\n\n` +
      `• **Cube Corner** — when you need cracking / fracture toughness or ultra-thin films\n` +
      `• **Cono-Spherical** — soft materials, scratch, or contact-mechanics work`
    )
  }
  return `**${entry.question}**\n\n${entry.answer}`
}

/** Short pointer to /applications — never dump the full note catalog. */
function notesReply(notes, { all = false } = {}) {
  if (all || !notes?.length) {
    return (
      `Application notes cover steel, coatings, biomaterials, polymers, and more — see [/applications](/applications).\n\n` +
      `Name your material or test type and I’ll point to the best note.`
    )
  }
  const top = notes.slice(0, 1)
  return (
    `Strong match: [${top[0].label}](${top[0].pdf}).\n\n` +
    `More on [/applications](/applications).`
  )
}

/** Detect application-note / PDF questions — keep answers crisp. */
function matchApplicationNotes(query) {
  const q = normalize(query)
  const explicitNotes = /(application note|app ?note|case stud|white ?paper)/.test(q)
  const genericDoc = /\bpdf\b|\bpdfs\b|download|whitepaper/.test(q)
  const wantsAll = /\b(list|all|every|full|entire|show|catalog|available)\b/.test(q)

  if (explicitNotes && wantsAll) {
    return notesReply([], { all: true })
  }

  const matches = retrieveRelevantNotes(query, 2)
  if (matches.length && (explicitNotes || genericDoc)) {
    return notesReply(matches)
  }
  if (explicitNotes) {
    return notesReply([], { all: true })
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
      suggestions: ['Steel coatings wear', 'NRL testing', 'View /applications', 'Contact'],
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
      text: formatTechFaqAnswer(techFaq[0], userMessage),
      suggestions: ['Which tip for hard surfaces?', 'What is dynamic nanoindentation?', 'NRL testing', 'Contact'],
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
  if (isNanotechQuery(text)) {
    return [
      'What is nanotechnology?',
      'SPM vs AFM imaging',
      'Explain contact mechanics',
      'How do I change a probe?',
    ]
  }
  if (/test|nrl|sample/.test(t)) return ['Open testing form', 'Services', 'Contact']
  if (/brochure|pdf|spec/.test(t)) return ['Get brochure', 'Products', 'Contact sales']
  if (/contact|sales|demo|quote/.test(t)) return ['Contact page', 'Brochure', 'NRL testing']
  return ['What is nanotechnology?', 'MesoProbe', 'μProbe 500', 'Contact']
}

/**
 * Prefer offline LLM when ready; otherwise knowledge engine.
 * Supports streaming via onToken.
 */
/** Queries we answer exactly from data (never let the model guess counts/lists/people). */
function formatTeamAnswer() {
  return (
    `Key Industron contacts listed on the website:\n\n` +
    COMPANY_FACTS.team
      .map((m) => {
        const phone = m.phone ? ` · ${m.phone}` : ''
        return `• **${m.name}** — ${m.role} (${m.email}${phone})`
      })
      .join('\n') +
    `\n\nWe do not publish a full employee directory online. For other enquiries: [/contact](/contact)`
  )
}

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

  // Never let the model invent staff names / org charts.
  const asksPeople =
    /\b(team|staff|employee|employees|people|members|contacts|directory|org(?:anisation|anization)? chart)\b/.test(q) ||
    /who (works|are|is).*(industron|company|team|staff|here)/.test(q) ||
    /(list|show|tell).*(team|staff|employee|people|contacts)/.test(q) ||
    /sales (person|contact|manager)|application engineer|contact person/.test(q) ||
    /\b(pratyank|kiran|asif)\b/.test(q)
  if (asksPeople) {
    return {
      text: formatTeamAnswer(),
      suggestions: ['Contact sales', 'NRL testing', 'Founder', 'Show products'],
      mode: 'knowledge',
    }
  }

  // Never dump the full application-note catalog — crisp redirect only.
  const explicitNotes = /(application note|app ?note|case stud|white ?paper)/.test(q)
  const enumerate = /\b(list|all|every|full|entire|show|catalog|available)\b/.test(q)
  const haveNotes = /(do you have|any).*(application note|app ?note|case stud)/.test(q)
  if ((explicitNotes && enumerate) || haveNotes) {
    return {
      text: notesReply([], { all: true }),
      suggestions: ['Steel coatings wear', 'Contact-lens indentation', 'NRL testing', 'View /applications'],
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

  // Instant FAQ / knowledge answers before corpus dumps (works offline).
  const faqHit = matchFaq(userMessage, getProductKnowledge())
  if (faqHit) {
    await streamText(faqHit, onToken, signal)
    return { text: faqHit, suggestions: suggestionsFor(userMessage), mode: 'knowledge' }
  }

  // Tip / instrument FAQ only — other questions go through book RAG.
  const tipLike =
    /tip|probe|berkovich|cube.?corner|cono.?spherical|indenter tip|noise floor|oliver.?pharr|dynamic nanoindent|thin film.?substrate|surface roughness/.test(
      normalize(userMessage),
    )
  if (tipLike) {
    const techFaqHit = retrieveRelevantFaq(userMessage, 1)
    if (techFaqHit.length) {
      const text = formatTechFaqAnswer(techFaqHit[0], userMessage)
      await streamText(text, onToken, signal)
      return {
        text,
        suggestions: ['Which tip for hard surfaces?', 'Cube Corner vs Berkovich', 'What is Oliver–Pharr?', 'Contact'],
        mode: 'knowledge',
      }
    }
  }

  const status = getOfflineLlmStatus()
  const siteOnly = isSiteOnlyQuery(userMessage)
  // Always pull private book PDFs for technical / general questions.
  const excerptOpts = { preferPrivate: true, perSource: 3 }
  const excerptK = 6
  const noteExcerpts = siteOnly ? [] : await getNoteExcerpts(userMessage, excerptK, excerptOpts)
  const hasBookRag = noteExcerpts.some((e) => e.public === false)
  const science = isNanotechQuery(userMessage) || hasBookRag

  // Instant-first: only use the enhanced engine when it is ALREADY loaded.
  if (preferLlm && status.ready) {
    try {
      const relevant = retrieveRelevantProducts(userMessage, 2)
      const system = buildSystemPrompt(relevant, userMessage, noteExcerpts, {
        mode: science && !siteOnly ? 'nanotech' : 'site',
      })
      const recent = history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(science ? -6 : -4)
        .map((m) => ({ role: m.role, content: String(m.text || '').slice(0, science ? 800 : 500) }))

      const messages = [
        { role: 'system', content: system },
        ...recent,
        { role: 'user', content: userMessage },
      ]

      let full = ''
      for await (const delta of streamOfflineChat(messages, {
        signal,
        maxTokens: 420,
        // Warm enough to sound conversational, cool enough to stay grounded in RAG.
        temperature: science ? 0.5 : 0.35,
        topP: 0.9,
        frequencyPenalty: 0.35,
      })) {
        full += delta
        onToken?.(full)
      }

      const text = full.trim()
      if (text) {
        return { text, suggestions: suggestionsFor(userMessage), mode: 'llm' }
      }
    } catch {
      // Fall through to knowledge / corpus reply.
    }
  } else if (preferLlm && shouldAutoLoadModel()) {
    scheduleOfflineLlmWarmup({ preferSoon: true })
  }

  // Book / note RAG for any matching question (not only nanotech keywords).
  if (!siteOnly && noteExcerpts.length) {
    const corpusText = formatCorpusTutorAnswer(userMessage, noteExcerpts)
    if (corpusText) {
      await streamText(corpusText, onToken, signal)
      return { text: corpusText, suggestions: suggestionsFor(userMessage), mode: 'rag' }
    }
  }

  const reply = generateChatReply(userMessage)
  await streamText(reply.text, onToken, signal)
  return reply
}

export function getWelcomeMessage() {
  return {
    text:
      `Hi — I’m **NanoGuide**.\n\n` +
      `Ask a technical question about nanotechnology, indentation, SPM/AFM, tribology, or materials testing — I’ll explain it clearly and briefly, like a short lecture note.\n\n` +
      `If you want an instrument recommendation, just ask (e.g. “which system for nanoindentation?”).`,
    suggestions: [
      'What is nanotechnology?',
      'How is in-situ SPM different from AFM?',
      'Explain Oliver–Pharr briefly',
      'Which system for nanoindentation?',
    ],
  }
}
