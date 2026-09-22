/**
 * Dedicated inquiry mailboxes. Brochure requests all go to sales@
 * (review first, then email the PDF to the visitor).
 *
 * Other channels:
 *   testing@  → NRL / application engineering
 *   enquiries@ → general desk
 *   sales@   → sales team + brochure approvals
 */

export const INQUIRY_CHANNELS = {
  brochure: {
    id: 'brochure',
    email: 'sales@industronnano.com',
    subjectPrefix: '[Brochure Request]',
    label: 'Brochure requests',
    description:
      'Product literature requests — reviewed by sales, then brochure emailed to the requester.',
    formPath: '/brochure-form',
    formLabel: 'Request a brochure',
  },
  testing: {
    id: 'testing',
    email: 'testing@industronnano.com',
    subjectPrefix: '[NRL Testing]',
    label: 'Material testing (NRL)',
    description:
      'First-hand sample testing, lab access, and advanced characterization enquiries.',
    formPath: '/testing-form',
    formLabel: 'Sample testing form',
  },
  general: {
    id: 'general',
    email: 'enquiries@industronnano.com',
    subjectPrefix: '[General]',
    label: 'General enquiries',
    description:
      'Partnerships, quick questions, and anything that does not fit brochure or testing.',
    formPath: null,
    formLabel: null,
  },
  sales: {
    id: 'sales',
    email: 'sales@industronnano.com',
    subjectPrefix: '[Sales Lead]',
    label: 'Sales & procurement',
    description:
      'Quotes, procurement evaluation, and industrial / QC instrument discussions.',
    formPath: null,
    formLabel: null,
  },
}

/** Brochure form answers that should go to sales (brochure CC’d for context). */
export const BROCHURE_SALES_REQUIREMENTS = new Set([
  'Industrial / QC',
  'Procurement evaluation',
])

export const INQUIRY_ROUTES = [
  INQUIRY_CHANNELS.brochure,
  INQUIRY_CHANNELS.testing,
  INQUIRY_CHANNELS.general,
  INQUIRY_CHANNELS.sales,
]

export function formatInquirySubject(prefix, ...parts) {
  const detail = parts.filter(Boolean).join(' — ')
  return detail ? `${prefix} ${detail}` : prefix
}

export function resolveBrochureMailto({ requirementType, product }) {
  // All brochure requests go to sales@ only (approval before sending PDF).
  return {
    to: INQUIRY_CHANNELS.sales.email,
    cc: undefined,
    subject: formatInquirySubject(
      '[Brochure Request]',
      product,
      requirementType || undefined,
    ),
    routedToSales: true,
  }
}

export function formDataToBody(form, headerLines = []) {
  const fd = new FormData(form)
  const lines = [...headerLines]
  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string' && value.trim()) {
      lines.push(`${key}: ${value.trim()}`)
    }
  }
  return lines.join('\n')
}

export function buildMailtoHref({ to, cc, subject, body }) {
  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  if (cc) params.push(`cc=${encodeURIComponent(cc)}`)
  const qs = params.length ? `?${params.join('&')}` : ''
  return `mailto:${to}${qs}`
}

const DEFAULT_MAX_BODY = 3200

export function openInquiryMailto({ to, cc, subject, body, maxBodyLength = DEFAULT_MAX_BODY }) {
  let bodyText = body
  const encoded = encodeURIComponent(bodyText)
  if (encoded.length > maxBodyLength) {
    bodyText = `${bodyText.slice(0, 2800)}\n\n[Message truncated — please add any missing details in your email.]`
  }
  window.location.href = buildMailtoHref({ to, cc, subject, body: bodyText })
}

export function openTestingInquiryMailto(form) {
  const { email, subjectPrefix } = INQUIRY_CHANNELS.testing
  const body = formDataToBody(form, ['Channel: NRL / material testing enquiry'])
  const subject = formatInquirySubject(subjectPrefix, 'First-hand sample enquiry')
  openInquiryMailto({ to: email, subject, body })
}
