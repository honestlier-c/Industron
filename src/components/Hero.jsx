import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import NanoindenterScene from '../three/NanoindenterScene'

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
}

export default function Hero() {
  const mouse     = useRef([0, 0])
  const scrollRef = useRef(0)
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 860 : false
  )

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 860)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth  - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      ]
    }
    const onTouch = (e) => {
      const t = e.touches[0]
      if (!t) return
      mouse.current = [
        (t.clientX / window.innerWidth  - 0.5) * 2,
        -(t.clientY / window.innerHeight - 0.5) * 2,
      ]
    }
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1)
    }
    window.addEventListener('mousemove',  onMove,   { passive: true })
    window.addEventListener('touchmove',  onTouch,  { passive: true })
    window.addEventListener('scroll',     onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('touchmove',  onTouch)
      window.removeEventListener('scroll',     onScroll)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-canvas">
        <Canvas
          camera={{
            position: isNarrow ? [0, 0.3, 7.2] : [0, 0.15, 7.0],
            fov: isNarrow ? 54 : 44,
          }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <NanoindenterScene mouse={mouse} scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      </div>

      <div className="container hero-content">
        <motion.div
          className="hero-tag"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="hero-tag-dot" />
          Industron Nanotechnology Pvt Ltd · Advanced Nanomechanical Solutions
        </motion.div>

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          High-Performance<br />
          Nanomechanical Testing Instruments<br />
          for Research &amp; Industry
        </motion.h1>

        <motion.p
          className="hero-sub"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Trusted by IISc, IITs, and global research labs for high-precision
          nanomechanical characterization across advanced materials and devices.
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <a href="#about" className="btn-primary">
            Explore Instruments <span aria-hidden="true">→</span>
          </a>
          <a href="/contact" className="btn-ghost">
            Request a Demo
          </a>
          <a href="/contact" className="btn-ghost">
            Get Technical Specs
          </a>
        </motion.div>

        <motion.div
          className="hero-trust"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <span className="hero-trust-label">Trusted by</span>
          {['IISc', 'IITs', 'Research Labs', 'Industry'].map((item) => (
            <span className="hero-trust-chip" key={item}>{item}</span>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
