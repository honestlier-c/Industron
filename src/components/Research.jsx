import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CUSTOMERS = [
  { name: 'IISc Bangalore', logo: '/Website/Customer/iisc-1-150x132.png' },
  { name: 'IIT Bombay', logo: '/Website/Customer/IITMumbai.png' },
  { name: 'IIT Madras', logo: '/Website/Customer/IITM.png' },
  { name: 'IIT Kanpur', logo: '/Website/Customer/IIT-Kanpur.png' },
  { name: 'IIT Roorkee', logo: '/Website/Customer/IIT-Roorkee.png' },
  { name: 'IIT Kharagpur', logo: '/Website/Customer/IITKharagpur.png' },
  { name: 'IIT Hyderabad', logo: '/Website/Customer/IITHyd.png' },
  { name: 'IIT Mandi', logo: '/Website/Customer/IIT-Mandi-150x147.png' },
  { name: 'IIT Indore', logo: '/Website/Customer/IIT-Indore-150x115.png' },
  { name: 'IIT Ropar', logo: '/Website/Customer/IIT-Ropar.png' },
  { name: 'IIT Patna', logo: '/Website/Customer/IITpatna.png' },
  { name: 'IIT BHU', logo: '/Website/Customer/IIT-BHU-300x61.png' },
  { name: 'NIT Calicut', logo: '/Website/Customer/NIT-Calicut-150x150.png' },
  { name: 'NIT Srinagar', logo: '/Website/Customer/NIT-Srinagar.png' },
  { name: 'NIT Warangal', logo: '/Website/Customer/National_Institute_of_Technology,_Warangal_logo.png' },
  { name: 'DRDO', logo: '/Website/Customer/drdo.png' },
  { name: 'ISRO', logo: '/Website/Customer/isro.png' },
  { name: 'CGCRI', logo: '/Website/Customer/CGCRI-150x118.png' },
  { name: 'Saha INP', logo: '/Website/Customer/Saha-INP-150x150.png' },
  { name: 'SCL', logo: '/Website/Customer/SCL-300x62.png' },
  { name: 'IIMT', logo: '/Website/Customer/IIMT.png' },
  { name: 'IIST', logo: '/Website/Customer/IIST-150x150.png' },
  { name: 'IISER Kolkata', logo: '/Website/Customer/IISER-Kolkata-150x150.png' },
  { name: 'GE', logo: '/Website/Customer/ge-150x72.png' },
  { name: 'Maruti', logo: '/Website/Customer/Maruti-150x57.png' },
  { name: 'RVCE', logo: '/Website/Customer/RVCE.png' },
]

// Duplicate just enough entries to fill the track for seamless CSS scrolling
// Using a smaller repeat factor instead of the full array × 2
const CUSTOMER_LOOP = [...CUSTOMERS, ...CUSTOMERS.slice(0, Math.ceil(CUSTOMERS.length / 2))]

export default function Research() {
  return (
    <section className="section section-alt" id="research">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-tag">Global Customers &amp; Collaborators</div>
          <h2>
            Trusted Across<br />
            <span className="gradient-text">India&rsquo;s Leading Institutions and Industries</span>
          </h2>
        </motion.div>

        <motion.p
          className="customers-intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          With <strong>40+ installations</strong> across top universities, national laboratories, and industry partners, Industron supports mission-critical nanomechanical testing programs worldwide. Our collaboration network accelerates breakthroughs in materials science, biomedical engineering, aerospace, and semiconductors.
        </motion.p>

        <motion.div
          className="customers-marquee"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="customers-track">
            {CUSTOMER_LOOP.map(({ name, logo }, idx) => (
              <div className="customer-logo-card" key={`${name}-${idx}`}>
                <img src={logo} alt={`${name} logo`} className="customer-logo-img customer-logo-img-real" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="customers-cta"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Link to="/contact" className="btn-primary">Start a Global Conversation</Link>
        </motion.div>
      </div>
    </section>
  )
}
