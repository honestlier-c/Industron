import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const HomePage         = lazy(() => import('./pages/HomePage'))
const AboutPage        = lazy(() => import('./pages/AboutPage'))
const ProductsPage     = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const ServicesPage     = lazy(() => import('./pages/ServicesPage'))
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'))
const ContactPage      = lazy(() => import('./pages/ContactPage'))
const TestingFormPage   = lazy(() => import('./pages/TestingFormPage'))
const BrochureFormPage  = lazy(() => import('./pages/BrochureFormPage'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default function App() {
  return (
    <>
      {/* Accessibility: skip repeated navigation on every page load */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <ScrollToTop />
      <Navbar />

      <div id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />

            {/* Legacy slug redirects */}
            <Route path="/products/pi-89"       element={<Navigate to="/products/pi-89-sem-picoindenter" replace />} />
            <Route path="/products/ts-77"        element={<Navigate to="/products/ts-77-select" replace />} />
            <Route path="/products/%CE%BCProbe-500" element={<Navigate to="/products/uprobe-500" replace />} />

            <Route path="/products/:productSlug" element={<ProductDetailPage />} />
            <Route path="/services"              element={<ServicesPage />} />
            <Route path="/applications"          element={<ApplicationsPage />} />
            <Route path="/contact"               element={<ContactPage />} />
            <Route path="/testing-form"          element={<TestingFormPage />} />
            <Route path="/brochure-form"         element={<BrochureFormPage />} />
            <Route path="/mesoprobe"             element={<Navigate to="/products/mesoprobe" replace />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </>
  )
}
