import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Industron'
const BASE_URL  = 'https://www.industronnano.com'
const DEFAULT_IMAGE = `${BASE_URL}/industron-og.png`

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Industron Nanotechnology Pvt Ltd',
  url: BASE_URL,
  logo: `${BASE_URL}/industron-logo.png`,
  description: 'India\'s leading provider of nanomechanical testing instruments for global R&D and industry.',
  foundingDate: '2011',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Unit #401, Fourth Floor, Thejaswini Building, Technopark',
      addressLocality: 'Thiruvananthapuram',
      addressRegion: 'Kerala',
      postalCode: '695581',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Suite 132, 4445 West 77th Street',
      addressLocality: 'Edina',
      addressRegion: 'MN',
      postalCode: '55435',
      addressCountry: 'US',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@industronnano.com',
    contactType: 'customer support',
  },
  sameAs: [
    'https://www.linkedin.com/company/industron-nanotechnology',
  ],
}

/**
 * Per-route SEO meta: title, description, Open Graph, Twitter Card,
 * canonical URL, and JSON-LD structured data.
 *
 * @param {string}  title        Page-specific title (appended with " | Industron")
 * @param {string}  description  150–160 character description
 * @param {string}  [canonical]  Full canonical URL
 * @param {string}  [image]      Absolute OG image URL
 * @param {string}  [type]       OG type — "website" (default) or "product"
 * @param {object}  [jsonld]     Additional JSON-LD object merged alongside Organization schema
 */
export default function SEOMeta({ title, description, canonical, image, type = 'website', jsonld }) {
  const fullTitle    = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nanomechanical Testing Instruments`
  const ogImage      = image || DEFAULT_IMAGE
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:url"         content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Organization JSON-LD (every page) */}
      <script type="application/ld+json">
        {JSON.stringify(ORG_JSONLD)}
      </script>

      {/* Optional per-page JSON-LD (e.g. Product schema) */}
      {jsonld && (
        <script type="application/ld+json">
          {JSON.stringify(jsonld)}
        </script>
      )}
    </Helmet>
  )
}
