import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

function secret() {
  const s = process.env.BROCHURE_APPROVE_SECRET || process.env.APPROVE_SECRET
  if (!s) throw new Error('BROCHURE_APPROVE_SECRET is not configured')
  return s
}

export function newRequestId() {
  return randomUUID()
}

/** token = id.exp.sig (HMAC-SHA256) — valid 14 days */
export function signApproveToken(id, ttlSeconds = 60 * 60 * 24 * 14) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${id}.${exp}`
  const sig = createHmac('sha256', secret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifyApproveToken(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) return { ok: false, error: 'Invalid token' }
  const [id, expStr, sig] = parts
  const exp = Number(expStr)
  if (!id || !Number.isFinite(exp)) return { ok: false, error: 'Invalid token' }
  if (exp < Math.floor(Date.now() / 1000)) return { ok: false, error: 'Link expired' }

  const payload = `${id}.${expStr}`
  const expected = createHmac('sha256', secret()).update(payload).digest('hex')
  try {
    const a = Buffer.from(sig, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: 'Invalid signature' }
    }
  } catch {
    return { ok: false, error: 'Invalid signature' }
  }
  return { ok: true, id }
}
