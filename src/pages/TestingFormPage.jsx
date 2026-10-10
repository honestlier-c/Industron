import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import { INQUIRY_CHANNELS, openTestingInquiryGmail } from '../config/inquiryEmails'

const SALES_EMAIL = INQUIRY_CHANNELS.testing.email
const OTHER_SUFFIX = ' — Other'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const opt = (label, hint) => ({ value: hint ? `${label} (${hint})` : label, label, hint })
const other = (label = 'Other', placeholder = 'Please specify') => ({
  value: label,
  label,
  other: true,
  placeholder,
})

const SECTIONS = [
  {
    id: 'contact',
    num: '01',
    title: 'Customer & contact details',
    intro: 'Who we should prepare the quotation for and how to reach you.',
    groups: [
      {
        fields: [
          { name: 'Organisation / Institution', required: true, autoComplete: 'organization' },
          { name: 'Department / Lab' },
          { name: 'Contact Person', label: 'Contact Person (Name)', required: true, autoComplete: 'name' },
          { name: 'Designation', autoComplete: 'organization-title' },
          { name: 'Email Address', type: 'email', required: true, autoComplete: 'email', placeholder: 'name@organisation.com' },
          { name: 'Phone / Mobile', type: 'tel', required: true, autoComplete: 'tel', placeholder: '+91 …' },
          { name: 'City & State', autoComplete: 'address-level2' },
          { name: 'Country', autoComplete: 'country-name', placeholder: 'India' },
          { name: 'Mailing / Delivery Address', type: 'textarea', full: true, rows: 2, autoComplete: 'street-address' },
          {
            name: 'Purpose of Procurement',
            type: 'textarea',
            full: true,
            required: true,
            rows: 3,
            placeholder: 'e.g. new research lab, QC of incoming material, funded project, replacing an existing system',
          },
          {
            name: 'Type of Test Required',
            type: 'chips',
            required: true,
            full: true,
            options: [opt('Tensile'), other('Other', 'Specify test type')],
          },
        ],
      },
    ],
  },
  {
    id: 'sample',
    num: '02',
    title: 'Material & sample',
    intro: 'What you will test and the geometry of a typical specimen.',
    groups: [
      {
        title: '2A · Material information',
        fields: [
          { name: 'Primary Material(s) to be Tested', required: true, full: true, placeholder: 'e.g. PLA filament, Al 6061 foil, electrospun PCL fibres' },
          { name: 'Material Form', full: true, placeholder: 'e.g. sheet, wire, moulded part' },
          {
            name: 'Type of Sample',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('Solid / Bulk', 'metal, ceramic, glass'),
              opt('Polymer', 'moulded / extruded'),
              opt('Micro / Nano Fiber or Thread'),
              opt('Thin Film / Sheet'),
              opt('Composite', 'CFRP / GFRP'),
              opt('Elastomer / Rubber'),
              opt('Biological / Soft Matter'),
              other(),
            ],
          },
          {
            name: 'Material Category',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('Metal / Alloy'),
              opt('Polymer / Plastic'),
              opt('Composite'),
              opt('Ceramic'),
              opt('Elastomer / Rubber'),
              opt('Textile / Fibre'),
              opt('Thin Film / Coating'),
              opt('Biological / Soft'),
              other(),
            ],
          },
        ],
      },
      {
        title: '2B · Sample geometry & dimensions',
        fields: [
          {
            name: 'Specimen Type',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('Dogbone / Dumbbell'),
              opt('Flat Coupon / Strip'),
              opt('Round Bar'),
              opt('Wire / Thread / Fibre'),
              opt('Tube'),
              opt('Film / Sheet'),
              other('Custom', 'Describe the specimen'),
            ],
          },
          { name: 'Gauge Length', type: 'unit', unit: 'mm', required: true, placeholder: '10' },
          { name: 'Gauge Width / Dia', type: 'unit', unit: 'mm', required: true, placeholder: '4' },
          { name: 'Gauge Thickness', type: 'unit', unit: 'mm', placeholder: '1', hint: 'For flat specimens' },
          { name: 'Total Sample Length', type: 'unit', unit: 'mm', placeholder: '50' },
          {
            name: 'Sample Cross-Section (Width × Thickness)',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('~5 mm × 1 mm', 'standard flat strip'),
              opt('~1 mm × 0.5 mm', 'narrow strip'),
              opt('~0.1 mm × 0.1 mm'),
              other('Other / Custom', 'Specify cross-section'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'test',
    num: '03',
    title: 'Test requirements',
    intro: 'Force, travel and the results you need from each test.',
    groups: [
      {
        title: '3A · Force & displacement range',
        fields: [
          {
            name: 'Preferred Force Range',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('< 1 N', 'micro / nano fibre regime'),
              opt('1 – 10 N'),
              opt('10 – 20 N'),
            ],
          },
          {
            name: 'Maximum Elongation Required',
            type: 'chips',
            required: true,
            full: true,
            options: [opt('< 10 mm'), opt('10 – 50 mm'), opt('> 50 mm'), opt('Not yet known')],
          },
        ],
      },
      {
        title: '3B · Measurements & properties of interest',
        fields: [
          {
            name: 'Properties to Be Measured',
            type: 'chips',
            required: true,
            full: true,
            options: [
              opt('Ultimate Tensile Strength', 'UTS'),
              opt('Yield Strength'),
              opt("Young's Modulus / Stiffness"),
              opt('Elongation at Break (%)'),
              opt('Toughness / Area under curve'),
              opt('Fracture Load & Displacement'),
              other(),
            ],
          },
          {
            name: 'Strain Measurement Method',
            type: 'chips',
            full: true,
            options: [
              opt('Crosshead displacement', 'adequate'),
              opt('Clip-on extensometer'),
              opt('Video / DIC', 'non-contact optical'),
              opt('No strain measurement needed'),
            ],
          },
          {
            name: 'Video Extensometer',
            type: 'radio',
            required: true,
            full: true,
            options: [
              opt('Required', 'non-contact, optical strain measurement on gauge length'),
              opt('Not Required', 'crosshead displacement is sufficient'),
            ],
          },
        ],
      },
    ],
  },
]

const sectionFields = (section) => section.groups.flatMap((g) => g.fields)
const isChoice = (field) => field.type === 'chips' || field.type === 'radio'
const fieldId = (name) => `crf-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

function isFilled(field, fd) {
  if (isChoice(field)) return fd.getAll(field.name).length > 0
  return String(fd.get(field.name) || '').trim().length > 0
}

function computeProgress(form) {
  const fd = new FormData(form)
  return Object.fromEntries(
    SECTIONS.map((section) => {
      const required = sectionFields(section).filter((f) => f.required)
      const done = required.filter((f) => isFilled(f, fd)).length
      return [section.id, { done, total: required.length }]
    }),
  )
}

function validate(form) {
  const fd = new FormData(form)
  const errors = {}
  for (const field of SECTIONS.flatMap(sectionFields)) {
    const value = String(fd.get(field.name) || '').trim()
    if (field.required && !isFilled(field, fd)) {
      errors[field.name] = isChoice(field) ? 'Select at least one option.' : 'This field is required.'
      continue
    }
    if (field.type === 'email' && value && !EMAIL_RE.test(value)) {
      errors[field.name] = 'Enter a valid email address.'
      continue
    }
    const otherOpt = field.options?.find((o) => o.other)
    if (otherOpt && fd.getAll(field.name).includes(otherOpt.value)) {
      if (!String(fd.get(field.name + OTHER_SUFFIX) || '').trim()) {
        errors[field.name] = `Please specify “${otherOpt.label}”.`
      }
    }
  }
  return errors
}

function buildEmailBody(form) {
  const fd = new FormData(form)
  const lines = ['CUSTOMER REQUIREMENTS FORM — Benchtop Tensile Testing System', '']
  for (const section of SECTIONS) {
    lines.push(`SECTION ${Number(section.num)} — ${section.title.toUpperCase()}`)
    for (const group of section.groups) {
      if (group.title) lines.push('', group.title.replace(' · ', '. '))
      for (const field of group.fields) {
        let value
        if (isChoice(field)) {
          const detail = String(fd.get(field.name + OTHER_SUFFIX) || '').trim()
          value = fd
            .getAll(field.name)
            .map((v) => {
              const isOther = field.options.find((o) => o.value === v)?.other
              return isOther && detail ? `${v}: ${detail}` : v
            })
            .join('; ')
        } else {
          value = String(fd.get(field.name) || '').trim()
          if (value && field.unit) value = `${value} ${field.unit}`
        }
        lines.push(`${field.label || field.name}: ${value || '—'}`)
      }
    }
    lines.push('')
  }
  lines.push('Submitted via www.industronnano.com/testing-form')
  return lines.join('\n')
}

function FieldLabel({ field, htmlFor, as: Tag = 'label' }) {
  const text = field.label || (field.unit ? `${field.name} (${field.unit})` : field.name)
  return (
    <Tag className="crf-label" {...(htmlFor ? { htmlFor } : {})}>
      {text}
      {field.required ? (
        <span className="crf-req" aria-hidden="true">*</span>
      ) : (
        <span className="crf-optional">Optional</span>
      )}
    </Tag>
  )
}

function ChoiceField({ field, error, otherOpen }) {
  const id = fieldId(field.name)
  const inputType = field.type === 'radio' ? 'radio' : 'checkbox'
  const otherOpt = field.options.find((o) => o.other)
  const wide = field.options.some((o) => o.hint && o.hint.length > 24)

  return (
    <fieldset
      id={id}
      className={`crf-field crf-group crf-field--full${error ? ' is-invalid' : ''}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <FieldLabel field={field} as="legend" />
      {field.type === 'chips' && (
        <span className="crf-hint crf-hint--legend">Select all that apply</span>
      )}
      <div className={`crf-options${wide ? ' crf-options--wide' : ''}`}>
        {field.options.map((o) => (
          <label key={o.value} className={`crf-chip crf-chip--${inputType}`}>
            <input
              type={inputType}
              name={field.name}
              value={o.value}
              data-other={o.other ? 'true' : undefined}
            />
            <span className="crf-chip-box" aria-hidden="true" />
            <span className="crf-chip-text">
              {o.label}
              {o.hint && <small>{o.hint}</small>}
            </span>
          </label>
        ))}
      </div>
      {otherOpt && otherOpen && (
        <input
          type="text"
          className="crf-input crf-other"
          name={field.name + OTHER_SUFFIX}
          placeholder={otherOpt.placeholder}
          aria-label={`${field.name} — ${otherOpt.label} detail`}
          autoFocus
        />
      )}
      {error && (
        <p className="crf-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

function InputField({ field, error }) {
  const id = fieldId(field.name)
  const common = {
    id,
    name: field.name,
    className: 'crf-input',
    placeholder: field.placeholder,
    autoComplete: field.autoComplete,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }

  let control
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={field.rows || 3} />
  } else if (field.type === 'unit') {
    control = (
      <div className="crf-unit">
        <input {...common} type="number" inputMode="decimal" step="any" min="0" />
        <span className="crf-unit-suffix" aria-hidden="true">{field.unit}</span>
      </div>
    )
  } else {
    control = <input {...common} type={field.type || 'text'} />
  }

  return (
    <div className={`crf-field${field.full ? ' crf-field--full' : ''}${error ? ' is-invalid' : ''}`}>
      <FieldLabel field={field} htmlFor={id} />
      {control}
      {error ? (
        <p className="crf-error" id={`${id}-error`}>{error}</p>
      ) : (
        field.hint && <span className="crf-hint">{field.hint}</span>
      )}
    </div>
  )
}

const EMPTY_PROGRESS = Object.fromEntries(
  SECTIONS.map((s) => [s.id, { done: 0, total: sectionFields(s).filter((f) => f.required).length }]),
)

export default function TestingFormPage() {
  const formRef = useRef(null)
  const [progress, setProgress] = useState(EMPTY_PROGRESS)
  const [errors, setErrors] = useState({})
  const [otherOpen, setOtherOpen] = useState({})
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const totals = Object.values(progress).reduce(
    (acc, p) => ({ done: acc.done + p.done, total: acc.total + p.total }),
    { done: 0, total: 0 },
  )
  const percent = Math.round((totals.done / totals.total) * 100)

  const handleChange = useCallback((event) => {
    const { target } = event
    const baseName = target.name?.endsWith(OTHER_SUFFIX)
      ? target.name.slice(0, -OTHER_SUFFIX.length)
      : target.name
    if (target.dataset?.other) {
      setOtherOpen((prev) => ({ ...prev, [target.name]: target.checked }))
    }
    setErrors((prev) => {
      if (!prev[baseName]) return prev
      const next = { ...prev }
      delete next[baseName]
      return next
    })
    setProgress(computeProgress(event.currentTarget))
    setStatus(null)
  }, [])

  const handleReset = () => {
    setProgress(EMPTY_PROGRESS)
    setErrors({})
    setOtherOpen({})
    setStatus(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = validate(form)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      setStatus({ type: 'error', count: Object.keys(nextErrors).length })
      const el = document.getElementById(fieldId(firstInvalid))
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = el?.matches('input, textarea') ? el : el?.querySelector('input, textarea')
      focusable?.focus({ preventScroll: true })
      return
    }
    const organisation = String(new FormData(form).get('Organisation / Institution') || '').trim()
    openTestingInquiryGmail({ body: buildEmailBody(form), organisation })
    setStatus({ type: 'sent' })
  }

  const handleCopy = async () => {
    if (!formRef.current) return
    try {
      await navigator.clipboard.writeText(buildEmailBody(formRef.current))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="testing-form-page crf-page">
      <SEOMeta
        title="Customer Requirements — Benchtop Tensile Testing System"
        description="Customer requirements form for Industron's Benchtop Tensile Testing System. Share contact, material, sample, and mechanical test details for a budgetary quotation."
        canonical="https://www.industronnano.com/testing-form"
      />
      <PageHero
        size="sm"
        tag="Customer requirements form"
        title="Benchtop Tensile"
        highlight="Testing System"
        lead="Tell us about your samples and test needs. We use this to configure your system and prepare a budgetary quotation."
      />

      <section className="crf-section">
        <div className="container crf-layout">
          <aside className="crf-aside" aria-label="Form progress">
            <div className="crf-progress-card">
              <div className="crf-progress-top">
                <span className="crf-progress-label">Progress</span>
                <span className="crf-progress-value">{percent}%</span>
              </div>
              <div
                className="crf-progress-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Required fields completed"
              >
                <span style={{ width: `${percent}%` }} />
              </div>
              <p className="crf-progress-meta">
                {totals.done} of {totals.total} required fields
              </p>
              <ol className="crf-steps">
                {SECTIONS.map((s) => {
                  const p = progress[s.id]
                  const done = p.done === p.total
                  return (
                    <li key={s.id} className={`crf-step${done ? ' is-done' : ''}`}>
                      <a href={`#crf-section-${s.id}`}>
                        <span className="crf-step-num" aria-hidden="true">
                          {done ? '✓' : Number(s.num)}
                        </span>
                        <span>
                          {s.title}
                          <span className="crf-step-meta">
                            {p.done}/{p.total} required
                          </span>
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </div>
            <p className="crf-aside-note">
              Takes about 5 minutes. Submitting opens Gmail with your answers addressed to{' '}
              <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>. Questions?{' '}
              <Link to="/contact">Contact us</Link>.
            </p>
          </aside>

          <motion.form
            ref={formRef}
            className="crf-form"
            noValidate
            onChange={handleChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={`crf-section-${section.id}`}
                className="crf-card"
                aria-labelledby={`crf-section-${section.id}-title`}
              >
                <header className="crf-card-head">
                  <span className="crf-card-num" aria-hidden="true">{section.num}</span>
                  <div>
                    <h2 id={`crf-section-${section.id}-title`}>{section.title}</h2>
                    <p>{section.intro}</p>
                  </div>
                </header>

                {section.groups.map((group, gi) => (
                  <div key={group.title || gi} className="crf-group-block">
                    {group.title && <h3 className="crf-sub">{group.title}</h3>}
                    <div className="crf-grid">
                      {group.fields.map((field) =>
                        isChoice(field) ? (
                          <ChoiceField
                            key={field.name}
                            field={field}
                            error={errors[field.name]}
                            otherOpen={Boolean(otherOpen[field.name])}
                          />
                        ) : (
                          <InputField key={field.name} field={field} error={errors[field.name]} />
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ))}

            <div className="crf-card crf-submit">
              {status?.type === 'error' && (
                <p className="crf-alert crf-alert--error" role="alert">
                  {status.count === 1
                    ? '1 field needs your attention.'
                    : `${status.count} fields need your attention.`}{' '}
                  They are highlighted above.
                </p>
              )}
              {status?.type === 'sent' && (
                <p className="crf-alert crf-alert--success" role="status">
                  Gmail opened in a new tab with your requirements filled in. Review the message and
                  click <strong>Send</strong>. If it didn’t open, use <strong>Copy details</strong> and
                  email <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>.
                </p>
              )}
              <div className="crf-submit-row">
                <div className="crf-submit-copy">
                  <strong>Ready to send?</strong>
                  <span>
                    Opens Gmail to {SALES_EMAIL} — you review and send from your own account.
                  </span>
                </div>
                <div className="crf-actions">
                  <button type="reset" className="crf-btn-text">Clear form</button>
                  <button type="button" className="btn-ghost crf-btn" onClick={handleCopy}>
                    {copied ? 'Copied ✓' : 'Copy details'}
                  </button>
                  <button type="submit" className="btn-primary crf-btn">Open in Gmail</button>
                </div>
              </div>
            </div>

            <footer className="crf-footer">
              <p>
                Industron Technical Services Pvt. Ltd. · Trivandrum, Kerala, India ·{' '}
                <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a> ·{' '}
                <a href="https://www.industronnano.com" target="_blank" rel="noopener noreferrer">
                  www.industronnano.com
                </a>
              </p>
              <p className="crf-footer-meta">
                DPIIT Start-up India · MSME Registered · DRDO TDF Registered
              </p>
            </footer>
          </motion.form>
        </div>
      </section>
    </main>
  )
}
