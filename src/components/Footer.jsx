import { Link } from 'react-router-dom'

const COLS = [
  {
    title: 'Services',
    links: [
      { label: 'Research & Development', href: '/services' },
      { label: 'Nanomechanical Instruments', href: '/products' },
      { label: 'Advanced Material Testing', href: '/services' },
      { label: 'Testing enquiry form', href: '/testing-form' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'NanoGuru®', href: '/products' },
      { label: 'NG50 / NG80', href: '/products' },
      { label: 'μProbe', href: '/products' },
      { label: 'MesoProbe', href: '/products/mesoprobe' },
      { label: 'Hysitron Instruments', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Customers', href: '/#research' },
      { label: 'Nanoyantrika', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

function isRoute(href = '') {
  return href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')
}

function FooterLink({ label, href }) {
  if (isRoute(href)) {
    return <Link to={href}>{label}</Link>
  }
  return <a href={href}>{label}</a>
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/industron-logo.png" alt="Industron" className="brand-logo-image" />
            </Link>
            <p>
              Designing, developing and marketing high performance scientific instruments
              since 2011. Trivandrum, India · Edina, MN, USA.
            </p>
          </div>

          {COLS.map(({ title, links }) => (
            <div className="footer-col" key={title}>
              <h5>{title}</h5>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 Industron Nanotechnology Pvt Ltd. All rights reserved.</span>
          <div className="footer-socials">
            {[
              { href: '#', label: 'Li', title: 'LinkedIn' },
              { href: '#', label: 'Tw', title: 'Twitter'  },
              { href: '#', label: 'Yt', title: 'YouTube'  },
            ].map(({ href, label, title }) => (
              <a key={title} href={href} className="footer-social" aria-label={title} title={title}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
