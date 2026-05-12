import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ServicesPage from './pages/ServicesPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ContactPage from './pages/ContactPage'
import TestingFormPage from './pages/TestingFormPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/pi-89" element={<Navigate to="/products/pi-89-sem-picoindenter" replace />} />
        <Route path="/products/ts-77" element={<Navigate to="/products/ts-77-select" replace />} />
        <Route path="/products/:productSlug" element={<ProductDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/testing-form" element={<TestingFormPage />} />
        <Route path="/mesoprobe" element={<Navigate to="/products/mesoprobe" replace />} />
      </Routes>
      <Footer />
    </>
  )
}
