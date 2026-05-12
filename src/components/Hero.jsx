import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
      {!isNarrow && (
        <div className="hero-canvas">
          <Canvas
            camera={{ position: [0, 0.15, 7.0], fov: 44 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <NanoindenterScene mouse={mouse} scrollRef={scrollRef} />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div className="container hero-content">
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
          Chosen by research institutions, engineering teams, and advanced manufacturers worldwide for high-precision nanomechanical characterization across next-generation materials and devices.
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <a href="#about" className="btn-primary">
            Explore Solutions <span aria-hidden="true">→</span>
          </a>
          <Link to="/contact" className="btn-ghost">
            Request Global Demo
          </Link>
          <Link to="/testing-form" className="btn-ghost">
            Get Your Material Tested
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
