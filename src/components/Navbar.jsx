import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'Applications', to: '/applications' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <motion.nav
      className={`navbar${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img
            src="/Industron_logo.png"
            alt="Industron"
            className="brand-logo-image nav-brand-logo-image"
          />
        </Link>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {LINKS.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'nav-link-active' : undefined)}
                onClick={() => setMenuOpen(false)}
                end={to === '/'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <Link to="/contact" className="nav-cta">Get in Touch</Link>
          <button
            type="button"
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
