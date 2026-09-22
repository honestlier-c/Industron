import { Resend } from 'resend'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

function resendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(key)
}

export function salesInbox() {
  return process.env.SALES_EMAIL || 'sales@industronnano.com'
}

export function fromAddress() {
  return process.env.BROCHURE_FROM_EMAIL || process.env.FROM_EMAIL || 'Industron <onboarding@resend.dev>'
}

export async function sendSalesApproveEmail({
  to,
  request,
  approveUrl,
}) {
  const resend = resendClient()
  const lines = [
    `<p>New brochure request — approve to send the PDF to the requester.</p>`,
    `<ul>`,
    `<li><strong>Name:</strong> ${escapeHtml(request.name)}</li>`,
    `<li><strong>Email:</strong> ${escapeHtml(request.email)}</li>`,
    `<li><strong>Organization:</strong> ${escapeHtml(request.organization)}</li>`,
    `<li><strong>Phone:</strong> ${escapeHtml(request.phone || '—')}</li>`,
    `<li><strong>Product:</strong> ${escapeHtml(request.productLabel)}</li>`,
    `<li><strong>Requirement:</strong> ${escapeHtml(request.requirementType)}</li>`,
    `</ul>`,
    `<p><a href="${approveUrl}" style="display:inline-block;padding:12px 18px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Approve &amp; send brochure</a></p>`,
    `<p style="color:#64748b;font-size:13px;">Or open: ${escapeHtml(approveUrl)}</p>`,
  ]

  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [to],
    subject: `[Brochure approval] ${request.productLabel} — ${request.name}`,
    html: lines.join('\n'),
  })
  if (error) throw new Error(error.message || 'Failed to email sales')
  return data
}

export async function sendBrochureToUser({ to, request, pdfPath, fileName }) {
  const resend = resendClient()
  const bytes = await readFile(pdfPath)
  const content = bytes.toString('base64')

  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [to],
    subject: `Your ${request.productLabel} brochure — Industron`,
    html: [
      `<p>Hi ${escapeHtml(request.name)},</p>`,
      `<p>Thanks for your interest in <strong>${escapeHtml(request.productLabel)}</strong>.</p>`,
      `<p>Your product brochure is attached. If you have questions, reply to this email or contact <a href="mailto:sales@industronnano.com">sales@industronnano.com</a>.</p>`,
      `<p>— Industron Technical Services</p>`,
    ].join('\n'),
    attachments: [
      {
        filename: fileName,
        content,
      },
    ],
  })
  if (error) throw new Error(error.message || 'Failed to email brochure')
  return data
}

export function brochurePdfPath(fileName) {
  return join(process.cwd(), 'private', 'Brochure', fileName)
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
