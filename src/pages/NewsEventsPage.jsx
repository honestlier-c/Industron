import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SEOMeta from '../components/SEOMeta'
import WebinarThumbnail from '../components/WebinarThumbnail'
import { fadeUp } from '../motion/presets'
import { UPCOMING_EVENTS, WEBINAR_LIBRARY } from '../data/newsEvents'

export default function NewsEventsPage() {
  return (
    <main className="news-events-page">
      <SEOMeta
        title="News & Events"
        description="Upcoming Industron events and on-demand webinar library — nanomechanical testing, in-situ methods, biomaterials, and property correlation."
        canonical="https://www.industronnano.com/news-events"
      />
      <PageHero
        tag="News & Events"
        title="Webinars &"
        highlight="industry events"
        lead="Catch up on recorded sessions from symposiums and webinar series, or check back for upcoming announcements."
        badges={['On-demand library', 'YouTube & Vimeo', 'Technical focus']}
      />

      <section className="page-section news-events-upcoming-section">
        <div className="container news-events-upcoming-block">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">Calendar</div>
            <h2>Upcoming events</h2>
          </motion.div>

          {UPCOMING_EVENTS.length === 0 ? (
            <p className="news-events-empty">No upcoming events</p>
          ) : (
            <ul className="news-events-upcoming-list">
              {UPCOMING_EVENTS.map((ev) => (
                <li key={ev.id}>{ev.title}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="page-section news-events-library-section">
        <div className="container">
          <motion.div
            className="page-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <div className="section-tag">On demand</div>
            <h2>Webinar library</h2>
            <p>Select a session to open the recording in a new tab.</p>
          </motion.div>

          <ul className="webinar-grid">
            {WEBINAR_LIBRARY.map((item, i) => (
              <motion.li
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={fadeUp}
                custom={i % 6}
              >
                <a
                  className="webinar-card"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WebinarThumbnail url={item.url} title={item.title} />
                  <div className="webinar-card-body">
                    {item.dateLabel && (
                      <time className="webinar-card-date" dateTime={item.dateLabel}>
                        {item.dateLabel}
                      </time>
                    )}
                    <h3 className="webinar-card-title">{item.title}</h3>
                    {item.subtitle && (
                      <p className="webinar-card-subtitle">{item.subtitle}</p>
                    )}
                    <span className="webinar-card-cta">Watch recording</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
