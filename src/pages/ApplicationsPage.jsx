import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/PageHero'
import PageCTA from '../components/PageCTA'
import { fadeUp } from '../motion/presets'
import SEOMeta from '../components/SEOMeta'
import { APPLICATION_INDUSTRIES as INDUSTRIES, TESTING_TECHNIQUES } from '../data/applicationNotes'

export default function ApplicationsPage() {
  const [active, setActive] = useState('Steel Industry')

  const industries = useMemo(
    () => INDUSTRIES.filter((i) => i.title === active),
    [active],
  )

  return (
    <main className="applications-page">
      <SEOMeta
        title="Applications"
        description="Nanomechanical testing applications across steel, pharma, automotive, aerospace, biomaterials, polymers, and more. Techniques from nanoindentation to DMA and high-temperature testing."
        canonical="https://www.industronnano.com/applications"
      />
      <PageHero
        tag="Applications"
        title="Nanomechanical applications"
        highlight="across industries"
        lead="Studying the mechanical response of materials at the nanoscale is now critical across global industries — driven by nanostructured materials and the continued miniaturization of engineering components, thin films, and surface coatings."
        badges={['Cross-sector', 'Multiple methods', 'In-situ ready', 'High-temp capable']}
      />

      {/* Industry-specific applications */}
      <section className="page-section">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">By industry</div>
            <h2>Industry-specific applications</h2>
            <p>Techniques and representative application notes, filtered by sector.</p>
          </motion.div>

          <div className="applications-filter" role="group" aria-label="Filter by industry">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.title}
                type="button"
                aria-pressed={active === ind.title}
                className={`applications-filter-chip${active === ind.title ? ' is-active' : ''}`}
                onClick={() => setActive(ind.title)}
              >
                {ind.title}
              </button>
            ))}
          </div>

          <motion.div className="applications-industry-list" layout>
            <AnimatePresence mode="popLayout">
              {industries.map((ind, i) => (
                <motion.article
                  key={ind.title}
                  layout
                  className={`applications-industry-card accent-${ind.accent}`}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="applications-industry-head">
                    <span className="applications-industry-bar" aria-hidden="true" />
                    <h3>{ind.title}</h3>
                  </div>
                  <div className="applications-two-col">
                    <div>
                      <h4 className="applications-sublabel">Techniques</h4>
                      <ul className="applications-bullet-list">
                        {ind.techniques.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="applications-sublabel">Application notes</h4>
                      <ol className="applications-notes-list">
                        {ind.notes.map((n) => (
                          <li key={n.label}>
                            {n.pdf ? (
                              <a
                                className="applications-note-link"
                                href={n.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="applications-note-label">{n.label}</span>
                                <span className="applications-note-pdf" aria-hidden="true">PDF</span>
                              </a>
                            ) : (
                              n.label
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Testing techniques */}
      <section className="page-section page-section-alt">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Methods</div>
            <h2>Testing techniques</h2>
            <p>Core methods supported across our platforms and lab services.</p>
          </motion.div>

          <div className="applications-tech-grid">
            {TESTING_TECHNIQUES.map((tech, i) => (
              <motion.article
                key={tech.title}
                className="applications-tech-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
                custom={i}
                variants={fadeUp}
              >
                <h3>{tech.title}</h3>
                <p>{tech.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        tag="Have a target application?"
        title="Tell us your material and"
        highlight="we'll recommend the global test workflow"
        lead="Share your specimen type and target property — our application engineers will propose the right technique and platform for your region and industry context."
        primary={{ label: 'Discuss Your Global Application', href: '/contact' }}
        secondary={{ label: 'View Services', href: '/services' }}
      />
    </main>
  )
}
