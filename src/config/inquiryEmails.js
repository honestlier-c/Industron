/**
 * Dedicated inquiry mailboxes — edit addresses here once IT creates them
 * in Google Workspace (or your host). Set up inbox rules / forwarding so:
 *   brochure@ → literature team (+ archive)
 *   testing@  → NRL / application engineering (e.g. forward from kp@)
 *   enquiries@ → general desk (or forward to info@)
 *   sales@   → sales team (e.g. forward to pratyank@)
 *
 * Subject prefixes ([Brochure], etc.) help filter and sort in any mail client.
 */

export const INQUIRY_CHANNELS = {
  brochure: {
    id: 'brochure',
    email: 'brochure@industronnano.com',
    subjectPrefix: '[Brochure]',
    label: 'Brochure requests',
    description:
      'Product literature downloads, PDF follow-up, and specification questions.',
    formPath: '/brochure-form',
    formLabel: 'Download a brochure',
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
  const isSalesLead = BROCHURE_SALES_REQUIREMENTS.has(requirementType)
  const primary = isSalesLead ? INQUIRY_CHANNELS.sales : INQUIRY_CHANNELS.brochure
  return {
    to: primary.email,
    cc: isSalesLead ? INQUIRY_CHANNELS.brochure.email : undefined,
    subject: formatInquirySubject(
      primary.subjectPrefix,
      product,
      requirementType || undefined,
    ),
    routedToSales: isSalesLead,
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
