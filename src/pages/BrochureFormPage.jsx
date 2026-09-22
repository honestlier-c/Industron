import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import { formDataToBody, openInquiryMailto, formatInquirySubject } from '../config/inquiryEmails'
import { SALES_EMAIL, submitBrochureViaGoogleScript } from '../utils/brochureRequest'

const PRODUCT_LABELS = {
  'uprobe-500': 'μProbe 500',
  mesoprobe: 'MesoProbe',
  ng80: 'NG80',
  'pneumatic-air-isolation-table': 'Pneumatic Air Isolation Table',
  'dic-software': 'DIC Software',
}

export default function BrochureFormPage() {
  const [params] = useSearchParams()
  const slug = params.get('product') ?? ''
  const product = PRODUCT_LABELS[slug] ?? 'Industron Instrument'

  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [usedMailtoFallback, setUsedMailtoFallback] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('Email') || '').trim()
    const requirementType = String(fd.get('Requirement type') || '').trim()
    const payload = {
      name: String(fd.get('Name') || '').trim(),
      organization: String(fd.get('Organization') || '').trim(),
      email,
      phone: String(fd.get('Phone') || '').trim(),
      requirementType,
      product,
      productSlug: slug,
    }

    try {
      await submitBrochureViaGoogleScript(payload)
      setUsedMailtoFallback(false)
      setUserEmail(email)
      setDone(true)
    } catch (err) {
      // No script URL yet → open mail draft to sales@
      const body = formDataToBody(form, [
        'Channel: Brochure request (sales approval required)',
        `Product: ${product}`,
        `Product slug: ${slug || 'n/a'}`,
        '',
        'Action for sales:',
        '1) Review this lead',
        `2) If approved, email the brochure PDF to: ${email}`,
      ])
      openInquiryMailto({
        to: SALES_EMAIL,
        subject: formatInquirySubject('[Brochure Request]', product, requirementType),
        body,
      })
      setUsedMailtoFallback(true)
      setUserEmail(email)
      setDone(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="testing-form-page">
      <SEOMeta
        title={`Request ${product} Brochure`}
        description={`Request the ${product} brochure from Industron. Share your details and our sales team will email the brochure after review.`}
        canonical={`https://www.industronnano.com/brochure-form${slug ? `?product=${slug}` : ''}`}
      />

      <PageHero
        tag="Product Literature"
        title={`${product}`}
        highlight="Brochure request"
        lead="Share a few details. After our sales team reviews your request, the brochure will be emailed to you."
        badges={['Sales reviewed', 'Sent by email', 'No instant download']}
      />

      <section className="page-section testing-form-section">
        <div className="container">
          <motion.div
            className="testing-form-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="testing-form-panel-head">
              <div>
                <p className="testing-modal-form-id">Brochure request</p>
                <h2 className="testing-form-panel-title">{product} — brochure request</h2>
                <p className="testing-form-panel-intro">
                  Complete the form below. Questions?{' '}
                  <Link to="/contact">Contact us</Link>
                  {' · '}
                  <Link to="/products">Product portfolio</Link>
                </p>
              </div>
            </header>

            {done ? (
              <div className="testing-form-done">
                <p className="testing-form-panel-intro">
                  Thank you. Your brochure will be sent soon to{' '}
                  <strong>{userEmail || 'your email id'}</strong> after our sales team reviews
                  the request.
                </p>
                <p className="testing-form-hint" style={{ marginTop: '0.75rem' }}>
                  {usedMailtoFallback ? (
                    <>
                      A draft email to <strong>{SALES_EMAIL}</strong> should have opened — please
                      send it so sales can review and email you the PDF.
                    </>
                  ) : (
                    <>
                      Your request went to <strong>{SALES_EMAIL}</strong>. After they approve, the
                      brochure PDF is emailed to you automatically — nothing downloads here.
                    </>
                  )}
                </p>
                <div className="testing-modal-actions" style={{ marginTop: '1.5rem' }}>
                  <Link to="/products" className="btn-ghost">
                    Back to products
                  </Link>
                  <Link to="/contact" className="btn-primary">
                    Talk to a specialist
                  </Link>
                </div>
              </div>
            ) : (
              <form className="testing-modal-form testing-form-page-grid" onSubmit={handleSubmit}>
                <div className="testing-modal-section-title">Your details</div>

                <label>
                  Full name
                  <input type="text" name="Name" required autoComplete="name" />
                </label>

                <label>
                  Organization / institution
                  <input type="text" name="Organization" required autoComplete="organization" />
                </label>

                <label>
                  Email
                  <input type="email" name="Email" required autoComplete="email" />
                </label>

                <label>
                  Phone
                  <input type="tel" name="Phone" autoComplete="tel" />
                </label>

                <label>
                  What describes your requirement best?
                  <select name="Requirement type" required defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="Learning / education">Learning / education</option>
                    <option value="Research">Research</option>
                    <option value="Industrial / QC">Industrial / QC</option>
                    <option value="Procurement evaluation">Procurement evaluation</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <p className="testing-form-hint">
                  Submitting notifies <strong>{SALES_EMAIL}</strong>. The brochure is emailed to
                  you after sales approval — it is not downloaded here.
                </p>

                <div className="testing-modal-actions">
                  <Link to="/products" className="btn-ghost">
                    Cancel
                  </Link>
                  <button type="submit" className="btn-primary" disabled={busy}>
                    {busy ? 'Submitting…' : 'Request brochure'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
