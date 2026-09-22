import { resolveBrochure, PRODUCT_LABELS } from './_lib/brochures.mjs'
import { newRequestId, signApproveToken } from './_lib/tokens.mjs'
import { saveRequest } from './_lib/store.mjs'
import { sendSalesApproveEmail, salesInbox } from './_lib/mail.mjs'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS })
  }
  if (req.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' })
  }

  try {
    const body = await req.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const organization = String(body.organization || '').trim()
    const phone = String(body.phone || '').trim()
    const requirementType = String(body.requirementType || '').trim()
    const slug = String(body.productSlug || '').trim()
    const productLabel =
      PRODUCT_LABELS[slug] || String(body.productLabel || '').trim() || 'Industron Instrument'

    if (!name || !email || !organization || !requirementType) {
      return json(400, { ok: false, error: 'Missing required fields' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { ok: false, error: 'Invalid email' })
    }

    const brochure = resolveBrochure(slug)
    if (!brochure) {
      return json(400, {
        ok: false,
        error: 'No brochure is available for this product yet. Please contact sales@industronnano.com.',
      })
    }

    const id = newRequestId()
    const createdAt = new Date().toISOString()
    const record = {
      id,
      name,
      email,
      organization,
      phone,
      requirementType,
      productSlug: brochure.slug,
      productLabel: brochure.label || productLabel,
      brochureFile: brochure.file,
      status: 'pending',
      createdAt,
    }

    await saveRequest(context, id, record)

    const siteUrl = (process.env.URL || process.env.SITE_URL || 'http://localhost:8888').replace(
      /\/$/,
      '',
    )
    const token = signApproveToken(id)
    const approveUrl = `${siteUrl}/.netlify/functions/brochure-approve?token=${encodeURIComponent(token)}`

    await sendSalesApproveEmail({
      to: salesInbox(),
      request: record,
      approveUrl,
    })

    return json(200, {
      ok: true,
      message: `Thanks — your brochure will be sent soon to ${email} after our team reviews the request.`,
      email,
    })
  } catch (err) {
    console.error('brochure-request', err)
    return json(500, {
      ok: false,
      error: err?.message || 'Could not submit brochure request',
    })
  }
}

export const config = { path: '/api/brochure-request' }
