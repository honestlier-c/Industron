import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { label: 'About',        to: '/about' },
  { label: 'Products',     to: '/products' },
  { label: 'Services',     to: '/services' },
  { label: 'Applications', to: '/applications' },
  { label: 'Contact',      to: '/contact' },
]

const MENU_ID = 'nav-mobile-menu'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on Escape; return focus to hamburger
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <nav
      className={`navbar${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}
    >
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={close}>
          <img
            src="/industron-logo.png"
            alt="Industron"
            className="brand-logo-image nav-brand-logo-image"
          />
        </Link>

        <ul
          id={MENU_ID}
          className={`nav-links${menuOpen ? ' open' : ''}`}
          aria-label="Main navigation"
        >
          {LINKS.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'nav-link-active' : undefined)}
                onClick={close}
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
            ref={hamburgerRef}
            type="button"
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  )
}
