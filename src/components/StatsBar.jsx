import { motion } from 'framer-motion'

const STATS = [
  { value: '30+',  label: 'Years of Experience'       },
  { value: '40+',  label: 'Installations in India'    },
  { value: '120+', label: 'Publications'              },
  { value: '4×',   label: 'R&D 100 Award Winner'      },
]

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
