/**
 * Submit brochure lead to Google Apps Script (nanoyantrika@gmail.com → sales@).
 * Uses GET + query params (Apps Script POST redirects fail in browsers).
 */

export const SALES_EMAIL = 'sales@industronnano.com'

export async function submitBrochureViaGoogleScript(payload) {
  const url = import.meta.env.VITE_BROCHURE_SCRIPT_URL?.trim()
  if (!url) {
    const err = new Error('SCRIPT_URL_MISSING')
    err.code = 'SCRIPT_URL_MISSING'
    throw err
  }

  const params = new URLSearchParams({
    name: payload.name || '',
    organization: payload.organization || '',
    email: payload.email || '',
    phone: payload.phone || '',
    requirementType: payload.requirementType || '',
    product: payload.product || '',
    productSlug: payload.productSlug || '',
  })

  const res = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  })

  // Opaque/offline failures still throw so mailto fallback can run.
  if (!res.ok) {
    const err = new Error(`Script failed (${res.status})`)
    err.code = 'SCRIPT_FAILED'
    throw err
  }

  const text = await res.text()
  try {
    const json = JSON.parse(text)
    if (json && json.ok === false) {
      const err = new Error(json.error || 'Script rejected request')
      err.code = 'SCRIPT_FAILED'
      throw err
    }
  } catch (e) {
    if (e.code === 'SCRIPT_FAILED') throw e
    // Non-JSON but HTTP 200 — treat as success (redirect quirks).
  }

  return { ok: true }
}
