import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  checkChatHealth,
  postChatMessage,
  toChatHistory,
} from '../utils/chatApi'

const WELCOME = {
  text: 'Hi — I’m NanoGuide. Ask about nanomechanical testing, instruments, or materials characterization.',
  suggestions: [
    'What is nanoindentation?',
    'Tell me about MesoProbe',
    'How do I contact Industron?',
  ],
}

/** Reveal assistant text with a typewriter effect. Returns a cancel() fn. */
function typewriterReveal(fullText, { onUpdate, onDone, msPerChar = 14, charsPerTick = 2 } = {}) {
  const text = String(fullText || '')
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  if (!text || reduced) {
    onUpdate?.(text)
    onDone?.(text)
    return () => {}
  }

  let i = 0
  let cancelled = false
  let timer = 0

  const tick = () => {
    if (cancelled) return
    i = Math.min(text.length, i + charsPerTick)
    onUpdate?.(text.slice(0, i))
    if (i >= text.length) {
      onDone?.(text)
      return
    }
    timer = window.setTimeout(tick, msPerChar)
  }

  timer = window.setTimeout(tick, msPerChar)
  return () => {
    cancelled = true
    window.clearTimeout(timer)
  }
}

function renderRichText(text) {
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\n)/g
  let last = 0
  let match
  let key = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{text.slice(last, match.index)}</span>)
    }
    const token = match[0]
    if (token === '\n') {
      parts.push(<br key={key++} />)
    } else if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (m) {
        const [, label, href] = m
        if (href.startsWith('/')) {
          parts.push(
            <Link key={key++} to={href} className="chatbot-link">
              {label}
            </Link>,
          )
        } else {
          parts.push(
            <a key={key++} href={href} className="chatbot-link" target="_blank" rel="noreferrer">
              {label}
            </a>,
          )
        }
      }
    }
    last = match.index + token.length
  }
  if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>)
  return parts
}

function SupportAvatar() {
  return (
    <div className="chatbot-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path
          d="M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7c-1.1 0-2.2-.3-3.1-.7L5 19l1.2-2.9C5.4 14.9 5 13.5 5 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="9.2" cy="12" r="0.9" fill="currentColor" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
        <circle cx="14.8" cy="12" r="0.9" fill="currentColor" />
      </svg>
    </div>
  )
}

export default function ChatBot() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [serverOk, setServerOk] = useState(null) // null | true | false
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: WELCOME.text,
      suggestions: WELCOME.suggestions,
    },
  ])
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const typeCancelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const controller = new AbortController()
    checkChatHealth({ signal: controller.signal })
      .then(() => setServerOk(true))
      .catch(() => setServerOk(false))
    const t = window.setTimeout(() => inputRef.current?.focus(), 180)
    return () => {
      controller.abort()
      window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, busy, open])

  useEffect(
    () => () => {
      abortRef.current?.abort()
      typeCancelRef.current?.()
    },
    [],
  )

  const revealAnswer = (assistantId, fullText) =>
    new Promise((resolve) => {
      typeCancelRef.current?.()
      typeCancelRef.current = typewriterReveal(fullText, {
        onUpdate: (partial) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, text: partial, streaming: true } : m,
            ),
          )
        },
        onDone: (finalText) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, text: finalText, streaming: false }
                : m,
            ),
          )
          resolve()
        },
      })
    })

  const ask = async (raw) => {
    const text = String(raw || '').trim()
    if (!text || busy) return

    abortRef.current?.abort()
    typeCancelRef.current?.()
    const controller = new AbortController()
    abortRef.current = controller

    const history = toChatHistory(messages)
    const userId = `u-${Date.now()}`
    const assistantId = `a-${Date.now()}`

    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, suggestions: undefined })),
      { id: userId, role: 'user', text },
      { id: assistantId, role: 'assistant', text: '', streaming: true },
    ])
    setInput('')
    setBusy(true)

    try {
      const { answer } = await postChatMessage({
        message: text,
        history,
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      setServerOk(true)
      const full =
        answer ||
        'I couldn’t find an answer for that. Try rephrasing, or ask something else.'
      await revealAnswer(assistantId, full)
    } catch (err) {
      if (err?.name === 'AbortError') return
      setServerOk(false)
      const full =
        err?.message ||
        'Couldn’t reach the chat server. Please try again in a moment.'
      await revealAnswer(assistantId, full)
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="chatbot-root">
      <AnimatePresence>
        {open && (
          <motion.section
            id={panelId}
            className="chatbot-panel"
            role="dialog"
            aria-label="NanoGuide chat"
            aria-modal="false"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="chatbot-header">
              <div className="chatbot-header-main">
                <SupportAvatar />
                <div>
                  <p className="chatbot-title">NanoGuide</p>
                  <p className="chatbot-status">
                    {serverOk === true ? (
                      <>
                        <span className="chatbot-status-dot chatbot-status-dot--llm" />
                        Online
                      </>
                    ) : serverOk === false ? (
                      <>
                        <span className="chatbot-status-dot chatbot-status-dot--offline" />
                        Server offline
                      </>
                    ) : (
                      <>
                        <span className="chatbot-status-dot" />
                        Connecting…
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="chatbot-icon-btn"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </header>

            <div className="chatbot-messages" ref={listRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`chatbot-bubble-row chatbot-bubble-row--${m.role}`}
                >
                  {m.role === 'assistant' && <SupportAvatar />}
                  <div className={`chatbot-bubble chatbot-bubble--${m.role}`}>
                    {m.text ? (
                      <div className="chatbot-bubble-text">
                        {renderRichText(m.text)}
                        {m.streaming && <span className="chatbot-caret" aria-hidden="true" />}
                      </div>
                    ) : (
                      <div className="chatbot-typing" aria-live="polite">
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                    {m.suggestions?.length > 0 && (
                      <div className="chatbot-suggestions">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="chatbot-chip"
                            onClick={() => ask(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form className="chatbot-composer" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="chatbot-input">
                Type your message
              </label>
              <input
                id="chatbot-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about nanotech, indentation, SPM…"
                autoComplete="off"
                disabled={busy}
              />
              <button
                type="submit"
                className="chatbot-send"
                disabled={busy || !input.trim()}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h12M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`chatbot-fab ${open ? 'chatbot-fab--open' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {open ? (
          <span aria-hidden="true">✕</span>
        ) : (
          <>
            <SupportAvatar />
            <span className="chatbot-fab-label">Chat</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
