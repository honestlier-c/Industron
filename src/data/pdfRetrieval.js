/**
 * Mini-RAG over application-note PDFs + private Chatbotdata corpus.
 * Loaded only when a visitor chats (not shown as website downloads).
 */

import { PDF_KNOWLEDGE } from './pdfKnowledge'
import { CHATBOT_DOCS_KNOWLEDGE } from './chatbotDocsKnowledge'

/** Flatten every note/doc chunk into a single searchable corpus. */
const CHUNKS = [
  ...PDF_KNOWLEDGE.flatMap((note) =>
    (note.chunks || []).map((text, i) => ({
      text,
      index: i,
      title: note.title,
      pdf: note.pdf,
      public: true,
      industries: note.industries || [],
    })),
  ),
  ...CHATBOT_DOCS_KNOWLEDGE.flatMap((doc) =>
    (doc.chunks || []).map((text, i) => ({
      text,
      index: i,
      title: doc.title,
      // Private corpus — cite by title only; never expose as a site download.
      pdf: null,
      public: false,
      industries: doc.topics || [],
    })),
  ),
]

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'using', 'used', 'into', 'onto', 'you',
  'your', 'have', 'has', 'does', 'about', 'any', 'note', 'notes', 'pdf', 'pdfs',
  'study', 'studies', 'paper', 'papers', 'show', 'give', 'tell', 'can', 'get',
  'what', 'which', 'how', 'this', 'that', 'are', 'was', 'were', 'its', 'their',
  'summarize', 'summary', 'explain', 'describe', 'tell', 'find', 'findings',
])

function tokenize(query) {
  return String(query || '')
    .toLowerCase()
    .replace(/[μµ]/g, 'u')
    .split(/[^a-z0-9+-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

/**
 * Retrieve the most relevant PDF / Chatbotdata chunks for a query.
 * Returns [{ title, pdf, text, industries, public }].
 *
 * @param {string} query
 * @param {number} [k=3]
 * @param {{ preferPrivate?: boolean, perSource?: number }} [opts]
 */
export function retrieveNoteExcerpts(query, k = 3, opts = {}) {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const preferPrivate = Boolean(opts.preferPrivate)
  const perSource = opts.perSource ?? (preferPrivate ? 3 : 2)

  const scored = CHUNKS.map((chunk) => {
    const hay = `${chunk.title} ${chunk.text}`.toLowerCase()
    let score = 0
    tokens.forEach((t) => {
      const stem = t.replace(/(ies|es|s)$/, '')
      if (hay.includes(t)) score += 2
      else if (stem.length > 2 && hay.includes(stem)) score += 1
    })
    // Soft boost for private nanotech corpus when teaching science topics.
    if (preferPrivate && chunk.public === false && score > 0) score += 1.5
    // Title hits are strong signals.
    const titleHay = String(chunk.title || '').toLowerCase()
    tokens.forEach((t) => {
      if (titleHay.includes(t)) score += 3
    })
    return { chunk, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const perNote = new Map()
  const picked = []
  for (const { chunk } of scored) {
    const key = chunk.pdf || `private:${chunk.title}`
    const count = perNote.get(key) || 0
    if (count >= perSource) continue
    perNote.set(key, count + 1)
    picked.push(chunk)
    if (picked.length >= k) break
  }
  return picked
}
