/**
 * Dedicated inquiry mailboxes. Brochure requests all go to sales@
 * (review first, then email the PDF to the visitor).
 *
 * Public contact inbox:
 *   sales@  → sales, support, brochures, and general enquiries
 *
 * Testing form may still use a dedicated subject prefix; mail goes to sales@.
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
    email: 'sales@industronnano.com',
    subjectPrefix: '[NRL Testing]',
    label: 'Material testing (NRL)',
    description:
      'First-hand sample testing, lab access, and advanced characterization enquiries.',
    formPath: '/testing-form',
    formLabel: 'Sample testing form',
  },
  general: {
    id: 'general',
    email: 'sales@industronnano.com',
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

/** Gmail web compose — opens logged-in account with To / Subject / Body filled. */
export function buildGmailComposeHref({ to, cc, subject, body }) {
  const params = new URLSearchParams()
  params.set('view', 'cm')
  params.set('fs', '1')
  if (to) params.set('to', to)
  if (cc) params.set('cc', cc)
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

const DEFAULT_MAX_BODY = 3200
const GMAIL_URL_SAFE_MAX = 7500

function truncateInquiryBody(body, maxChars = 2800) {
  const text = String(body || '')
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars)}\n\n[Message truncated — please add any missing details in your email.]`
}

export function openInquiryMailto({ to, cc, subject, body, maxBodyLength = DEFAULT_MAX_BODY }) {
  let bodyText = body
  const encoded = encodeURIComponent(bodyText)
  if (encoded.length > maxBodyLength) {
    bodyText = truncateInquiryBody(bodyText)
  }
  window.location.href = buildMailtoHref({ to, cc, subject, body: bodyText })
}

export function openInquiryGmailCompose({ to, cc, subject, body }) {
  let bodyText = body
  let href = buildGmailComposeHref({ to, cc, subject, body: bodyText })
  if (href.length > GMAIL_URL_SAFE_MAX) {
    bodyText = truncateInquiryBody(bodyText, 2200)
    href = buildGmailComposeHref({ to, cc, subject, body: bodyText })
  }

  const opened = window.open(href, '_blank', 'noopener,noreferrer')
  if (!opened) {
    window.location.assign(href)
  }
}

export function openTestingInquiryMailto(form) {
  const { email, subjectPrefix } = INQUIRY_CHANNELS.testing
  const body = formDataToBody(form, ['Channel: NRL / material testing enquiry'])
  const subject = formatInquirySubject(subjectPrefix, 'First-hand sample enquiry')
  openInquiryGmailCompose({ to: email, subject, body })
}
