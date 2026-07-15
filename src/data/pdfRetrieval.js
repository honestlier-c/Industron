/**
 * Mini-RAG over the extracted application-note PDF text (src/data/pdfKnowledge.js).
 * This module is dynamically imported by the chat engine so the ~180 KB of
 * PDF text is only downloaded when a visitor actually chats.
 */

import { PDF_KNOWLEDGE } from './pdfKnowledge'

/** Flatten every note's chunks into a single searchable corpus. */
const CHUNKS = PDF_KNOWLEDGE.flatMap((note) =>
  (note.chunks || []).map((text, i) => ({
    text,
    index: i,
    title: note.title,
    pdf: note.pdf,
    industries: note.industries || [],
  })),
)

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
 * Retrieve the most relevant PDF chunks for a query.
 * Returns [{ title, pdf, text, industries }].
 */
export function retrieveNoteExcerpts(query, k = 3) {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const scored = CHUNKS.map((chunk) => {
    const hay = `${chunk.title} ${chunk.text}`.toLowerCase()
    let score = 0
    tokens.forEach((t) => {
      const stem = t.replace(/(ies|es|s)$/, '')
      if (hay.includes(t)) score += 2
      else if (stem.length > 2 && hay.includes(stem)) score += 1
    })
    return { chunk, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  // Prefer variety: cap to 2 chunks per note so answers aren't one-note-heavy.
  const perNote = new Map()
  const picked = []
  for (const { chunk } of scored) {
    const count = perNote.get(chunk.pdf) || 0
    if (count >= 2) continue
    perNote.set(chunk.pdf, count + 1)
    picked.push(chunk)
    if (picked.length >= k) break
  }
  return picked
}
