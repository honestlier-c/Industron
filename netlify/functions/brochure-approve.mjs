import { verifyApproveToken } from './_lib/tokens.mjs'
import { getRequest, updateRequest } from './_lib/store.mjs'
import { sendBrochureToUser, brochurePdfPath } from './_lib/mail.mjs'

function htmlPage(title, bodyHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Industron</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:2rem}
    .card{max-width:520px;margin:3rem auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:1.75rem;box-shadow:0 10px 30px rgba(15,23,42,.06)}
    h1{font-size:1.25rem;margin:0 0 .75rem}
    p{line-height:1.55;color:#334155}
    a{color:#1d4ed8}
  </style>
</head>
<body><div class="card">${bodyHtml}</div></body>
</html>`
}

export default async (req, context) => {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') || ''
    const verified = verifyApproveToken(token)
    if (!verified.ok) {
      return new Response(
        htmlPage('Invalid link', `<h1>Link not valid</h1><p>${verified.error}. Ask the requester to submit the form again.</p>`),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      )
    }

    const record = await getRequest(context, verified.id)
    if (!record) {
      return new Response(
        htmlPage('Not found', `<h1>Request not found</h1><p>This brochure request is missing or expired.</p>`),
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      )
    }

    if (record.status === 'sent') {
      return new Response(
        htmlPage(
          'Already sent',
          `<h1>Already sent</h1><p>The <strong>${record.productLabel}</strong> brochure was already emailed to <strong>${record.email}</strong>.</p>`,
        ),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      )
    }

    const pdfPath = brochurePdfPath(record.brochureFile)
    await sendBrochureToUser({
      to: record.email,
      request: record,
      pdfPath,
      fileName: record.brochureFile,
    })

    await updateRequest(context, verified.id, {
      status: 'sent',
      approvedAt: new Date().toISOString(),
      approvedBy: 'sales-link',
    })

    return new Response(
      htmlPage(
        'Brochure sent',
        `<h1>Brochure sent</h1>
         <p>Approved. The <strong>${record.productLabel}</strong> brochure was emailed to <strong>${record.email}</strong>.</p>
         <p><a href="https://www.industronnano.com">Back to industronnano.com</a></p>`,
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  } catch (err) {
    console.error('brochure-approve', err)
    return new Response(
      htmlPage('Error', `<h1>Could not send</h1><p>${String(err?.message || err)}</p>`),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
}

export const config = { path: '/api/brochure-approve' }
