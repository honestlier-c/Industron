import Hero from '../components/Hero'
import About from '../components/About'
import Research from '../components/Research'
import Contact from '../components/Contact'
import SEOMeta from '../components/SEOMeta'

export default function HomePage() {
  return (
    <>
      <SEOMeta
        title="Nanomechanical Testing Instruments"
        description="Industron — India's leading provider of nanomechanical testing instruments. Nanoindentation, in-situ SEM/TEM, tribology, and meso-scale testing for global R&D and industry."
        canonical="https://www.industronnano.com/"
      />
      <Hero />
      <About />
      <Research />
      <Contact />
    </>
  )
}
