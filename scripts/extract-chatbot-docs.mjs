/**
 * Extract text from dist/Chatbotdata into src/data/chatbotDocsKnowledge.js
 * for the support chat RAG only (not published as website downloads).
 *
 *   npm run extract:chatbot
 */

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, basename, extname } from 'node:path'
import { createRequire } from 'node:module'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC_DIR = resolve(ROOT, 'dist/Chatbotdata')
const OUT_FILE = resolve(ROOT, 'src/data/chatbotDocsKnowledge.js')

const CHUNK_SIZE = 900
const CHUNK_OVERLAP = 150
/** Soft cap per document so the chat bundle stays usable in-browser. */
const MAX_CHARS_PER_DOC = 180_000

function cleanText(raw) {
  return String(raw || '')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^\d+$/.test(l) && !/^page \d+/i.test(l))
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/-\s+/g, '')
    .trim()
}

function chunkText(text) {
  const chunks = []
  let i = 0
  while (i < text.length) {
    let end = Math.min(i + CHUNK_SIZE, text.length)
    if (end < text.length) {
      const slice = text.slice(i, end)
      const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf(' '))
      if (lastStop > CHUNK_SIZE * 0.5) end = i + lastStop + 1
    }
    const piece = text.slice(i, end).trim()
    if (piece.length > 40) chunks.push(piece)
    if (end >= text.length) break
    i = Math.max(end - CHUNK_OVERLAP, i + 1)
  }
  return chunks
}

function guessTopics(name) {
  const n = name.toLowerCase()
  if (n.includes('spm') || n.includes('afm')) return ['SPM', 'AFM', 'nanoindentation', 'in-situ imaging']
  if (n.includes('probe') || n.includes('t-014')) return ['probe', 'tip change', 'transducer', 'calibration']
  if (n.includes('tribolog') || n.includes('contact mechanic')) return ['tribology', 'contact mechanics', 'wear', 'friction']
  if (n.includes('ashby') || n.includes('materials engineering')) return ['materials', 'processing', 'design', 'properties']
  if (n.includes('nanoscale')) return ['nanoscale', 'nanotechnology', 'materials']
  if (n.includes('hutchings') || n.includes('tabor')) return ['tribology', 'wear', 'friction', 'Tabor']
  if (n.includes('reference manual') || /\bc\b/.test(n)) return ['reference']
  return ['technical reference']
}

function titleFromFilename(name) {
  return basename(name, extname(name))
    .replace(/\s+/g, ' ')
    .replace(/Â©/g, '')
    .trim()
}

async function extractDocx(filePath) {
  const { stdout } = await execFileAsync('textutil', ['-convert', 'txt', '-stdout', filePath], {
    maxBuffer: 20 * 1024 * 1024,
  })
  return cleanText(stdout)
}

async function extractPdfWithPdfParse(filePath) {
  const buf = await readFile(filePath)
  const parser = new PDFParse({ data: new Uint8Array(buf) })
  try {
    const parsed = await parser.getText()
    return cleanText(parsed.text)
  } finally {
    try {
      await parser.destroy?.()
    } catch {
      /* ignore */
    }
  }
}

/** Fallback for PDFs pdf-parse rejects (bad xref / structure). */
async function extractPdfWithPypdf(filePath) {
  const { stdout } = await execFileAsync(
    'python3',
    [
      '-c',
      [
        'from pypdf import PdfReader',
        'import sys',
        'r = PdfReader(sys.argv[1], strict=False)',
        'parts = []',
        'for p in r.pages:',
        '    try:',
        '        t = p.extract_text() or ""',
        '    except Exception:',
        '        t = ""',
        '    if t.strip(): parts.append(t)',
        'print("\\n".join(parts))',
      ].join('\n'),
      filePath,
    ],
    { maxBuffer: 80 * 1024 * 1024 },
  )
  return cleanText(stdout)
}

async function extractPdf(filePath) {
  try {
    return await extractPdfWithPdfParse(filePath)
  } catch (err) {
    console.warn(`  ↳ pdf-parse failed (${err.message}); trying pypdf…`)
    return extractPdfWithPypdf(filePath)
  }
}

async function main() {
  const entries = (await readdir(SRC_DIR)).filter((f) => !f.startsWith('.'))
  const docs = []

  for (const file of entries) {
    const ext = extname(file).toLowerCase()
    if (!['.pdf', '.docx', '.txt'].includes(ext)) continue

    const filePath = resolve(SRC_DIR, file)
    const id = basename(file, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80)

    try {
      let text =
        ext === '.docx'
          ? await extractDocx(filePath)
          : ext === '.txt'
            ? cleanText(await readFile(filePath, 'utf8'))
            : await extractPdf(filePath)

      let truncated = false
      if (text.length > MAX_CHARS_PER_DOC) {
        text = text.slice(0, MAX_CHARS_PER_DOC)
        truncated = true
      }

      const chunks = chunkText(text)
      docs.push({
        id,
        title: titleFromFilename(file),
        source: `dist/Chatbotdata/${file}`,
        topics: guessTopics(file),
        chars: text.length,
        truncated,
        chunks,
      })
      console.log(
        `✓ ${file} — ${text.length} chars, ${chunks.length} chunks${truncated ? ' (truncated)' : ''}`,
      )
    } catch (err) {
      console.warn(`✗ ${file}: ${err.message}`)
    }
  }

  const header = `/**
 * AUTO-GENERATED by scripts/extract-chatbot-docs.mjs — do not edit by hand.
 * Private AI corpus from dist/Chatbotdata (chat RAG only; not website downloads).
 * Re-run: npm run extract:chatbot
 */
`
  await writeFile(OUT_FILE, `${header}export const CHATBOT_DOCS_KNOWLEDGE = ${JSON.stringify(docs, null, 2)}\n`, 'utf8')
  const totalChunks = docs.reduce((n, d) => n + d.chunks.length, 0)
  console.log(`\nWrote ${OUT_FILE}`)
  console.log(`${docs.length} docs, ${totalChunks} chunks`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
