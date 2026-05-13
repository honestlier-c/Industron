import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import NanoindenterScene from '../three/NanoindenterScene'

/** Isolated chunk: Three.js + R3F + the hero scene — loaded lazily from Hero.jsx */
export default function HeroCanvas({ mouse, scrollRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 7.0], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <NanoindenterScene mouse={mouse} scrollRef={scrollRef} />
      </Suspense>
    </Canvas>
  )
}
