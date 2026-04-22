import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingParticles({ count = 120 }) {
  const ref = useRef()

  const { positions, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const offsets   = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22
      offsets[i] = Math.random() * Math.PI * 2
    }
    return { positions, offsets }
  }, [count])

  useFrame((state) => {
    const t   = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.4 + offsets[i]) * 0.002
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#06b6d4"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  )
}

function Molecule({ mouse, scrollRef }) {
  const groupRef  = useRef()
  const ring1Ref  = useRef()
  const ring2Ref  = useRef()
  const ring3Ref  = useRef()
  const elec1Ref  = useRef()
  const elec2Ref  = useRef()

  const vertices = useMemo(() => {
    const g   = new THREE.IcosahedronGeometry(1.4, 1)
    const pos = g.attributes.position
    const arr = []
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i))
      if (!arr.some(u => u.distanceTo(v) < 0.01)) arr.push(v)
    }
    g.dispose()
    return arr
  }, [])

  useFrame((state, delta) => {
    const t      = state.clock.elapsedTime
    const scroll = scrollRef.current   // 0 → 1
    const mx     = mouse.current[0]
    const my     = mouse.current[1]

    // Continuous auto-rotation
    groupRef.current.rotation.y += delta * 0.07
    groupRef.current.rotation.x += delta * 0.035

    // Mouse parallax — smooth lerp
    const tRX = -my * 0.45 + scroll * Math.PI * 0.5
    const tRY =  mx * 0.45
    groupRef.current.rotation.x += (tRX - groupRef.current.rotation.x) * 0.035
    groupRef.current.rotation.y += (tRY - groupRef.current.rotation.y) * 0.035

    // Float bob
    groupRef.current.position.y = Math.sin(t * 0.65) * 0.2

    // Scale down slightly as user scrolls
    const s = THREE.MathUtils.lerp(0.88, 0.58, scroll)
    groupRef.current.scale.setScalar(s)

    // Rings spin
    ring1Ref.current.rotation.z += delta * 0.28
    ring2Ref.current.rotation.y += delta * 0.18
    ring3Ref.current.rotation.x += delta * 0.22

    // Electron orbits
    elec1Ref.current.position.set(
      Math.cos(t * 0.9) * 2.25,
      Math.sin(t * 0.9) * 0.6,
      Math.sin(t * 0.9) * 2.25,
    )
    elec2Ref.current.position.set(
      Math.cos(t * 0.6 + 2) * 2.75,
      Math.sin(t * 1.1 + 1) * 0.8,
      Math.sin(t * 0.6 + 2) * 1.8,
    )
  })

  return (
    <group ref={groupRef} position={[2.9, 0, 0]}>
      {/* Core — dark metallic icosahedron */}
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshPhysicalMaterial
          color="#000000"
          metalness={1}
          roughness={0.01}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>

      {/* Cyan wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial color="#0369a1" wireframe transparent opacity={0.38} />
      </mesh>

      {/* Glowing vertex atoms */}
      {vertices.map((v, i) => (
        <mesh key={i} position={[v.x, v.y, v.z]}>
          <sphereGeometry args={[0.055, 14, 14]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Orbital ring 1 — cyan */}
      <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0.2]}>
        <mesh>
          <torusGeometry args={[2.25, 0.013, 16, 160]} />
          <meshBasicMaterial color="#0369a1" transparent opacity={0.72} />
        </mesh>
      </group>

      {/* Orbital ring 2 — purple */}
      <group ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 5, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[2.75, 0.009, 16, 160]} />
          <meshBasicMaterial color="#4338ca" transparent opacity={0.62} />
        </mesh>
      </group>

      {/* Orbital ring 3 — small cyan */}
      <group ref={ring3Ref} rotation={[-Math.PI / 5, Math.PI / 3, 0.1]}>
        <mesh>
          <torusGeometry args={[1.75, 0.009, 16, 160]} />
          <meshBasicMaterial color="#0369a1" transparent opacity={0.54} />
        </mesh>
      </group>

      {/* Electron 1 */}
      <mesh ref={elec1Ref}>
        <sphereGeometry args={[0.075, 14, 14]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Electron 2 */}
      <mesh ref={elec2Ref}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function MoleculeScene({ mouse, scrollRef }) {
  return (
    <>
      <fog attach="fog" args={['#dbeafe', 14, 34]} />

      <ambientLight intensity={0.18} />
      <pointLight position={[7, 6, 4]}   intensity={2.2} color="#06b6d4" />
      <pointLight position={[-5, -5, -3]} intensity={1.1} color="#7c3aed" />
      <pointLight position={[0, 2, 7]}   intensity={0.6} color="#ffffff" />

      <FloatingParticles count={140} />
      <Molecule mouse={mouse} scrollRef={scrollRef} />
    </>
  )
}
