import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import {
  INQUIRY_CHANNELS,
  formDataToBody,
  openInquiryMailto,
  resolveBrochureMailto,
} from '../config/inquiryEmails'
const PRODUCT_LABELS = {
  'uprobe-500':  'μProbe 500',
  'mesoprobe':   'MesoProbe',
  'ng50':        'NG50 / NanoGuru®',
  'ng80':        'NG80',
}
const BROCHURE_FILES = {
  'uprobe-500':  '/Ammuu_Latest.pdf',
  'mesoprobe':   '/Ammuu_Latest.pdf',
  'ng50':        '/Ammuu_Latest.pdf',
  'ng80':        '/Ammuu_Latest.pdf',
}

export default function BrochureFormPage() {
  const [params] = useSearchParams()
  const slug    = params.get('product') ?? ''
  const product = PRODUCT_LABELS[slug] ?? 'Industron Instrument'
  const file    = BROCHURE_FILES[slug] ?? '/Ammuu_Latest.pdf'

  const [done, setDone] = useState(false)
  const [notice, setNotice] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const requirementType = new FormData(form).get('Requirement type')?.toString() ?? ''
    const { to, cc, subject, routedToSales } = resolveBrochureMailto({
      requirementType,
      product,
    })
    const body = formDataToBody(form, [
      `Channel: ${routedToSales ? 'Sales lead (brochure)' : 'Brochure request'}`,
      `Product: ${product}`,
    ])
    openInquiryMailto({ to, cc, subject, body })

    /* Trigger download automatically */
    const a = document.createElement('a')
    a.href = file
    a.download = ''
    a.target   = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()

    setDone(true)
    const mailbox = routedToSales
      ? INQUIRY_CHANNELS.sales.email
      : INQUIRY_CHANNELS.brochure.email
    setNotice(
      `Your email app should open with a draft to ${mailbox}. The brochure download has started automatically.`,
    )
  }

  return (
    <main className="testing-form-page">
      <SEOMeta
        title={`Get ${product} Brochure`}
        description={`Download the ${product} product brochure from Industron. Fill in your details and receive the latest specifications, features, and application information.`}
        canonical={`https://www.industronnano.com/brochure-form${slug ? `?product=${slug}` : ''}`}
      />

      <PageHero
        tag="Product Literature"
        title={`${product}`}
        highlight="Brochure Download"
        lead="Share a few details so we can tailor follow-up support. Your brochure will start downloading immediately after you submit."
        badges={['Latest specs', 'Application notes', 'Free download']}
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
                <h2 className="testing-form-panel-title">{product} — product brochure</h2>
                <p className="testing-form-panel-intro">
                  Complete the form below. Questions?{' '}
                  <Link to="/contact">Contact us</Link>
                  {' · '}
                  <Link to="/products">Product portfolio</Link>
                </p>
              </div>
            </header>

            {notice && (
              <p className="testing-form-notice" role="status">
                {notice}
              </p>
            )}

            {done ? (
              <div className="testing-form-done">
                <p className="testing-form-panel-intro">
                  Thank you! If the download did not start,{' '}
                  <a href={file} download target="_blank" rel="noopener noreferrer">
                    click here to download directly
                  </a>.
                </p>
                <div className="testing-modal-actions" style={{ marginTop: '1.5rem' }}>
                  <Link to="/products" className="btn-ghost">Back to products</Link>
                  <Link to="/contact" className="btn-primary">Talk to a specialist</Link>
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
                    <option value="" disabled>Select one</option>
                    <option value="Learning / education">Learning / education</option>
                    <option value="Research">Research</option>
                    <option value="Industrial / QC">Industrial / QC</option>
                    <option value="Procurement evaluation">Procurement evaluation</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <p className="testing-form-hint">
                  Submitting opens your email app to{' '}
                  <strong>{INQUIRY_CHANNELS.brochure.email}</strong>
                  {' '}(or <strong>{INQUIRY_CHANNELS.sales.email}</strong> for industrial /
                  procurement requests). The brochure PDF downloads at the same time.
                </p>

                <div className="testing-modal-actions">
                  <Link to="/products" className="btn-ghost">Cancel</Link>
                  <button type="submit" className="btn-primary">
                    Download brochure
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
