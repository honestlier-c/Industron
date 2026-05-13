import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'

const TESTING_EMAIL = 'kp@industronnano.com'

function buildMailtoBody(form) {
  const fd = new FormData(form)
  const lines = []
  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string' && value.trim()) {
      lines.push(`${key}: ${value.trim()}`)
    }
  }
  return lines.join('\n')
}

export default function TestingFormPage() {
  const [notice, setNotice] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const bodyRaw = buildMailtoBody(form)
    const subject = encodeURIComponent('First-hand sample testing enquiry')
    let body = encodeURIComponent(bodyRaw)
    if (body.length > 3200) {
      body = encodeURIComponent(
        `${bodyRaw.slice(0, 2800)}\n\n[Message truncated — please add any missing details in your email.]`,
      )
    }
    window.location.href = `mailto:${TESTING_EMAIL}?subject=${subject}&body=${body}`
    setNotice(
      'Your email app should open with this enquiry as a draft. If it does not, copy your answers and send them manually.',
    )
  }

  return (
    <main className="testing-form-page">
      <SEOMeta
        title="Material Testing Enquiry"
        description="Submit a material testing enquiry to Industron's Nanomechanics Research Lab (NRL). We handle nanoindentation, tribology, and advanced material characterization for academia and industry."
        canonical="https://www.industronnano.com/testing-form"
      />
      <PageHero
        tag="Nanomechanics Research Lab (NRL)"
        title="Sample testing"
        highlight="enquiry form"
        lead="Share first-hand sample and study details so our application team can scope feasibility, timeline, and next steps."
        badges={['Academic & industry', 'Chargeable access', 'Application support']}
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
                <p className="testing-modal-form-id">Form: A</p>
                <h2 className="testing-form-panel-title">First-hand sample information form</h2>
                <p className="testing-form-panel-intro">
                  For enquiries to <strong>Advanced Material Testing</strong> and NRL access.
                  Questions?{' '}
                  <Link to="/contact">Contact us</Link>
                  {' · '}
                  <Link to="/services">Services overview</Link>
                </p>
              </div>
            </header>

            {notice && (
              <p className="testing-form-notice" role="status">
                {notice}{' '}
                <a href={`mailto:${TESTING_EMAIL}`}>{TESTING_EMAIL}</a>
              </p>
            )}

            <form className="testing-modal-form testing-form-page-grid" onSubmit={handleSubmit}>
              <div className="testing-modal-section-title">Organization details</div>
              <label>
                Organization / institution name
                <input type="text" name="Organization" required autoComplete="organization" />
              </label>
              <label>
                Department
                <input type="text" name="Department" autoComplete="organization-title" />
              </label>

              <div className="testing-modal-section-title">Contact person</div>
              <label>
                Name
                <input type="text" name="Contact name" required autoComplete="name" />
              </label>
              <label>
                Designation
                <input type="text" name="Designation" />
              </label>
              <label>
                Email
                <input type="email" name="Email" required autoComplete="email" />
              </label>
              <label>
                Contact number
                <input type="tel" name="Contact number" autoComplete="tel" />
              </label>
              <label>
                Research interest
                <textarea name="Research interest" rows="3" />
              </label>

              <div className="testing-modal-section-title">Details of sample</div>
              <label>
                Type of material
                <input type="text" name="Type of material" />
              </label>
              <label>
                Form of the material
                <input type="text" name="Form of material" />
              </label>
              <label>
                Purpose of study / interest in material properties
                <textarea name="Study purpose" rows="3" />
              </label>
              <label>
                Comments
                <textarea name="Comments" rows="3" />
              </label>
              <label>
                Expected number of samples
                <input type="number" name="Expected samples" min="1" step="1" />
              </label>
              <label>
                Paid / non-paid testing
                <select name="Paid or non-paid testing" defaultValue="">
                  <option value="" disabled>
                    Select option
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Non-paid">Non-paid</option>
                </select>
              </label>

              <p className="testing-form-hint">
                Submitting opens your default email app with this information addressed to{' '}
                <strong>{TESTING_EMAIL}</strong> (Application Engineer — material testing). You can
                edit the message before sending.
              </p>

              <div className="testing-modal-actions">
                <Link to="/" className="btn-ghost">
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Open email with enquiry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
