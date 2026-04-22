const COLS = [
  {
    title: 'Services',
    links: [
      { label: 'Research & Development', href: '/services' },
      { label: 'Nanomechanical Instruments', href: '/products' },
      { label: 'Advanced Material Testing', href: '/services' },
      { label: 'DSIR Recognized R&D Unit', href: '/about' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'NanoGuru®', href: '/products' },
      { label: 'NG50 / NG80', href: '/products' },
      { label: 'μProbe', href: '/products' },
      { label: 'MesoProbe', href: '/products' },
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

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <img src="/Industron_logo.png" alt="Industron" className="brand-logo-image" />
            </a>
            <p>
              Designing, developing and marketing high performance scientific instruments
              since 2011. Trivandrum, India · Edina, MN, USA.
            </p>
          </div>

          {COLS.map(({ title, links }) => (
            <div className="footer-col" key={title}>
              <h5>{title}</h5>
              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}><a href={href}>{label}</a></li>
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
