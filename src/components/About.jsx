import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const SERVICES = [
  {
    icon: '◈',
    title: 'Research & Development',
    paragraphs: [
      'Industron, formerly known as Hysitron India, established its R&D center and began operations in India in 2011 with a strategic focus on the design, development, and engineering of advanced nanomechanical testing systems. With a strong foundation in precision instrumentation and applied materials science, the team has played a key role in advancing nano‑ micro and meso‑scale mechanical characterization technologies.',
      'Following the acquisition of Hysitron by Bruker Corporation in 2017, the Indian R&D operations seamlessly transitioned under the new organizational identity of Industron Technical Services, continuing as a critical technology development and engineering partner. Industron has since contributed to multiple state‑of‑the‑art nanomechanical testing platforms, driven by in‑house innovation, collaborative research with premier institutes such as IISc Bangalore, and high‑level technical consultancy and product development support to Bruker.',
    ],    
  },
  {
    icon: '⊙',
    title: 'Mechanical Testing Instruments & Anti‑Vibration Tables',
    paragraphs: [
      
      'Today, Industron is a leading solution provider for mechanical testing and materials characterization, addressing length scales from nano to meso. The company takes pride in developing the world’s first affordable depth‑sensing indentation system spanning the micro‑ to meso‑scale, effectively bridging a critical gap in advanced materials characterization.',
      'In addition to high‑performance research‑grade systems, Industron is actively developing educational and training instruments to support fundamental research, hands‑on learning, and routine laboratory operations. Complementing its indigenous innovations, Industron offers state‑of‑the‑art nanomechanical testing solutions from Bruker’s Hysitron portfolio, including flagship platforms such as the TI 990, TI 980, and TI Premier II.',
      'Further strengthening its product ecosystem, Industron is indigenously developing anti‑vibration tables and essential surface‑characterization accessories, enabling high‑precision measurements and stable experimental environments.',
    ],
  },
  {
    icon: '◇',
    title: 'Advanced Material Testing',
    paragraphs: [
      'Our leadership is committed to contributing to the research community from both academia and industry through the setup of the "Nanomechanics Research Lab (NRL)".',
      'The lab is equipped with advanced nanoindentation techniques and an experienced application team. Our team is dedicated to supporting customers in India and also offers exclusive application support to industry.',
    ],
  },
]

export default function About() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!isFormOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEsc = (event) => {
      if (event.key === 'Escape') setIsFormOpen(false)
    }
    window.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onEsc)
    }
  }, [isFormOpen])

  return (
    <>
    <section className="section" id="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Our Services</div>
          <h2>
            What we do at<br />
            <span className="gradient-text">Industron</span>
          </h2>
        </motion.div>

        <div className="services-grid">
          {SERVICES.map(({ icon, title, paragraphs }, i) => (
            <motion.div
              key={title}
              className="service-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              <div className="service-icon">{icon}</div>
              <h3>{title}</h3>
              {paragraphs.map((text, j) => (
                <p key={j}>{text}</p>
              ))}
              {title === 'Mechanical Testing Instruments & Anti‑Vibration Tables' && (
                <a href="#hero" className="btn-primary" style={{ marginTop: '0.75rem', width: 'fit-content' }}>
                  Instruments
                </a>
              )}
              {title === 'Advanced Material Testing' && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '0.75rem', width: 'fit-content', border: 'none', cursor: 'pointer' }}
                  onClick={() => setIsFormOpen(true)}
                >
                  Enquriring for Testing
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    {isFormOpen && (
      <div
        className="testing-modal-backdrop"
        onClick={() => setIsFormOpen(false)}
        role="presentation"
      >
        <div
          className="testing-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-info-form-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="testing-modal-header">
            <div>
              <p className="testing-modal-form-id">Form: A</p>
              <h3 id="sample-info-form-title">First Hand sample Information Form</h3>
            </div>
            <button
              type="button"
              className="testing-modal-close"
              onClick={() => setIsFormOpen(false)}
              aria-label="Close form"
            >
              x
            </button>
          </div>

          <form className="testing-modal-form">
            <div className="testing-modal-section-title">Organization Details</div>
            <label>
              Organization Details:
              <input type="text" name="organizationDetails" />
            </label>
            <label>
              Department:
              <input type="text" name="department" />
            </label>

            <div className="testing-modal-section-title">Contact person detail</div>
            <label>
              Name:
              <input type="text" name="contactName" />
            </label>
            <label>
              Designation:
              <input type="text" name="designation" />
            </label>
            <label>
              Email ID:
              <input type="email" name="email" />
            </label>
            <label>
              Contact Number:
              <input type="tel" name="contactNumber" />
            </label>
            <label>
              Research Interest:
              <textarea name="researchInterest" rows="3" />
            </label>

            <div className="testing-modal-section-title">Details of sample</div>
            <label>
              Type of Material:
              <input type="text" name="materialType" />
            </label>
            <label>
              Form of the Material:
              <input type="text" name="materialForm" />
            </label>
            <label>
              Purpose of Study / Interest of Material properties:
              <textarea name="studyPurpose" rows="3" />
            </label>
            <label>
              Comments:
              <textarea name="comments" rows="3" />
            </label>
            <label>
              Expected number of samples:
              <input type="number" min="1" name="sampleCount" />
            </label>
            <label>
              Paid / non paid testing:
              <select name="testingType" defaultValue="">
                <option value="" disabled>Select option</option>
                <option value="paid">Paid</option>
                <option value="non-paid">Non paid</option>
              </select>
            </label>

            <div className="testing-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">Submit Enquiry</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}
