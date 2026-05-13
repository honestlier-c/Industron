import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ==================================================================
   Proper Berkovich 3-sided pyramid geometry — apex pointing DOWN
================================================================== */
function useBerkovichGeometry(radius = 0.24, height = 0.48) {
  return useMemo(() => {
    const r = radius, h = height
    const a = [ r,     0, 0                    ]
    const b = [-r / 2, 0, r * Math.sqrt(3) / 2 ]
    const c = [-r / 2, 0,-r * Math.sqrt(3) / 2 ]
    const apex = [0, -h, 0]

    const v = new Float32Array([
      ...a, ...apex, ...b,
      ...b, ...apex, ...c,
      ...c, ...apex, ...a,
      ...a, ...c,    ...b,
    ])
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [radius, height])
}

function BerkovichPyramid(props) {
  const geom = useBerkovichGeometry(0.24, 0.48)
  return (
    <mesh geometry={geom} {...props}>
      <meshPhysicalMaterial
        color="#f8fafc"
        metalness={0.85}
        roughness={0.04}
        clearcoat={1}
        clearcoatRoughness={0.02}
        reflectivity={1}
        emissive="#e0e7ff"
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

/* ==================================================================
   Probe assembly — properly oriented: shaft → transducer → NARROWING
   frustum mount → Berkovich diamond tip pointing DOWN
================================================================== */
function ProbeAssembly({ tipRef }) {
  return (
    <group ref={tipRef}>
      {/* Shaft */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.5, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.3} />
      </mesh>

      {/* Transducer ring */}
      <mesh position={[0, 0.98, 0]}>
        <torusGeometry args={[0.2, 0.04, 16, 48]} />
        <meshStandardMaterial
          color="#2563eb"
          metalness={0.3}
          roughness={0.3}
          emissive="#1d4ed8"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Frustum mount — NARROWS going down (top=0.16, bottom=0.09) */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.16, 0.09, 0.42, 48]} />
        <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.32} />
      </mesh>

      {/* Tip holder collar */}
      <mesh position={[0, 0.47, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 48]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Berkovich diamond tip — base at y=0.44, apex at y=-0.04 (pointing DOWN) */}
      <BerkovichPyramid position={[0, 0.44, 0]} />

      {/* Contact glow at apex */}
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/* ==================================================================
   Sample disc — reflective top + rim + soft shadow
================================================================== */
function SampleSurface({ indentRef, ringRefs, glowRef, useReflection }) {
  const SAMPLE_W = 2.7   // sample width / depth (square slab)
  const SAMPLE_H = 0.18  // slab thickness
  const TOP_Y    = SAMPLE_H / 2 + 0.001

  return (
    <group position={[0, -1.05, 0]}>
      {/* Square slab base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[SAMPLE_W, SAMPLE_H, SAMPLE_W]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.45} roughness={0.5} />
      </mesh>

      {/* Polished top face (reflective on desktop) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, TOP_Y, 0]}>
        <planeGeometry args={[SAMPLE_W, SAMPLE_W]} />
        {useReflection ? (
          <MeshReflectorMaterial
            blur={[200, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={0.55}
            roughness={0.35}
            depthScale={0.6}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#eef2f7"
            metalness={0.55}
            mirror={0.55}
          />
        ) : (
          <meshPhysicalMaterial
            color="#eef2f7"
            metalness={0.35}
            roughness={0.28}
            clearcoat={0.75}
            clearcoatRoughness={0.1}
          />
        )}
      </mesh>

      {/* Dynamic contact glow at impact point */}
      <mesh
        ref={glowRef}
        position={[0, TOP_Y + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0} />
      </mesh>

      {/* Force wave rings (physically correct — waves radiate circularly) */}
      {ringRefs.map((ref, i) => (
        <mesh
          key={i}
          ref={ref}
          position={[0, TOP_Y + 0.008, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.08, 0.095, 96]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0} />
        </mesh>
      ))}

      {/* Residual triangular (Berkovich) indent */}
      <mesh
        ref={indentRef}
        position={[0, TOP_Y + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.001}
      >
        <circleGeometry args={[0.065, 3]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

/* ==================================================================
   Chart — axes, ticks, loading/unloading curves, residual drop-line
================================================================== */
function ForceDepthChart({ cycleRef }) {
  const dotRef = useRef()

  const {
    loadingLine, unloadingLine, axes, frame, tickMarks, dropLine, N
  } = useMemo(() => {
    const N = 48
    const H_RES = 0.3
    const loadingPos   = new Float32Array(N * 3)
    const unloadingPos = new Float32Array(N * 3)

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1)
      loadingPos[i * 3 + 0] = t
      loadingPos[i * 3 + 1] = Math.pow(t, 1.7)
      loadingPos[i * 3 + 2] = 0

      const h = 1 - t * (1 - H_RES)
      const F = Math.max(0, Math.pow((h - H_RES) / (1 - H_RES), 1.5))
      unloadingPos[i * 3 + 0] = h
      unloadingPos[i * 3 + 1] = F
      unloadingPos[i * 3 + 2] = 0
    }

    const mkLine = (arr, color, opacity = 1) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
      g.setDrawRange(0, 0)
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      return new THREE.Line(g, m)
    }
    const loadingLine   = mkLine(loadingPos,   '#2563eb')
    const unloadingLine = mkLine(unloadingPos, '#7c3aed')

    const axPos = new Float32Array([
      0, 0, 0,  1.08, 0, 0,
      0, 0, 0,  0, 1.08, 0,
    ])
    const axG = new THREE.BufferGeometry()
    axG.setAttribute('position', new THREE.BufferAttribute(axPos, 3))
    const axes = new THREE.LineSegments(
      axG,
      new THREE.LineBasicMaterial({ color: '#475569', transparent: true, opacity: 0.85 })
    )

    // Tick marks
    const tickPos = []
    const tickLen = 0.03
    ;[0.25, 0.5, 0.75, 1.0].forEach((v) => {
      tickPos.push(v, -tickLen, 0,  v, 0, 0)
      tickPos.push(-tickLen, v, 0,  0, v, 0)
    })
    const tkG = new THREE.BufferGeometry()
    tkG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tickPos), 3))
    const tickMarks = new THREE.LineSegments(
      tkG,
      new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.7 })
    )

    // Dashed residual drop-line at h = H_RES (appears after retract)
    const DASHES = 10
    const dashPos = new Float32Array(DASHES * 2 * 3)
    for (let i = 0; i < DASHES; i++) {
      const y0 = (i / DASHES) * 0.95 + 0.01
      const y1 = y0 + 0.03
      dashPos[i * 6 + 0] = H_RES; dashPos[i * 6 + 1] = y0; dashPos[i * 6 + 2] = 0
      dashPos[i * 6 + 3] = H_RES; dashPos[i * 6 + 4] = y1; dashPos[i * 6 + 5] = 0
    }
    const dG = new THREE.BufferGeometry()
    dG.setAttribute('position', new THREE.BufferAttribute(dashPos, 3))
    const dropLine = new THREE.LineSegments(
      dG,
      new THREE.LineBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0 })
    )

    // Panel frame
    const ox = -0.22, oy = -0.2, w = 1.46, hP = 1.38
    const fPos = new Float32Array([
      ox,     oy,       0,  ox + w, oy,       0,
      ox + w, oy,       0,  ox + w, oy + hP,  0,
      ox + w, oy + hP,  0,  ox,     oy + hP,  0,
      ox,     oy + hP,  0,  ox,     oy,       0,
    ])
    const fG = new THREE.BufferGeometry()
    fG.setAttribute('position', new THREE.BufferAttribute(fPos, 3))
    const frame = new THREE.LineSegments(
      fG,
      new THREE.LineBasicMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.75 })
    )

    return { loadingLine, unloadingLine, axes, frame, tickMarks, dropLine, N }
  }, [])

  useFrame(() => {
    const cycle = cycleRef.current
    let lc = 0, uc = 0, dx = 0, dy = 0, show = false, dropOpacity = 0

    if (cycle < 0.375) {
      const p = cycle / 0.375
      lc = Math.ceil(p * N)
      dx = p;  dy = Math.pow(p, 1.7)
      show = true
    } else if (cycle < 0.5) {
      lc = N; dx = 1; dy = 1; show = true
    } else if (cycle < 0.75) {
      const p = (cycle - 0.5) / 0.25
      lc = N
      uc = Math.ceil(p * N)
      dx = 1 - p * 0.7
      dy = Math.max(0, Math.pow((dx - 0.3) / 0.7, 1.5))
      show = true
      dropOpacity = Math.min(0.75, p * 1.5)
    } else {
      const p = (cycle - 0.75) / 0.25
      lc = Math.floor(N * (1 - p))
      uc = Math.floor(N * (1 - p))
      dropOpacity = 0.75 * (1 - p)
    }

    loadingLine.geometry.setDrawRange(0, lc)
    unloadingLine.geometry.setDrawRange(0, uc)
    dropLine.material.opacity = dropOpacity

    if (dotRef.current) {
      dotRef.current.position.set(dx, dy, 0.01)
      dotRef.current.visible = show
    }
  })

  return (
    <group position={[1.75, -0.45, 0]} scale={0.82}>
      {/* Panel */}
      <mesh position={[0.5, 0.5, -0.02]}>
        <planeGeometry args={[1.44, 1.34]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.82} />
      </mesh>
      <mesh position={[0.5, 0.5, -0.015]}>
        <planeGeometry args={[1.44, 1.34]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.06} />
      </mesh>
      <primitive object={frame} />

      <primitive object={tickMarks} />
      <primitive object={axes} />
      <primitive object={dropLine} />
      <primitive object={loadingLine} />
      <primitive object={unloadingLine} />

      <mesh ref={dotRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      <Text
        position={[0.5, 1.15, 0]}
        fontSize={0.085}
        color="#2563eb"
        anchorX="center"
        anchorY="bottom"
        letterSpacing={0.14}
        fontWeight="700"
      >
        LOAD – DEPTH
      </Text>
      <Text
        position={[0.5, -0.24, 0]}
        fontSize={0.075}
        color="#475569"
        anchorX="center"
        anchorY="top"
      >
        Depth (h)
      </Text>
      <Text
        position={[-0.24, 0.5, 0]}
        fontSize={0.075}
        color="#475569"
        anchorX="center"
        anchorY="bottom"
        rotation={[0, 0, Math.PI / 2]}
      >
        Load (F)
      </Text>
      <Text
        position={[0.3, -0.09, 0]}
        fontSize={0.06}
        color="#7c3aed"
        anchorX="center"
        anchorY="top"
      >
        h_p
      </Text>
    </group>
  )
}

/* ==================================================================
   Main rig with 3/4 tilt + contact shadow
================================================================== */
function IndenterRig({ mouse, scrollRef }) {
  const outerRef  = useRef()
  const innerRef  = useRef()
  const tipRef    = useRef()
  const indentRef = useRef()
  const glowRef   = useRef()
  const ring1     = useRef()
  const ring2     = useRef()
  const ring3     = useRef()
  const cycleRef  = useRef(0)
  const ringRefs  = [ring1, ring2, ring3]

  const { size } = useThree()
  const isNarrow = size.width < 860
  const isTiny   = size.width < 600

  useFrame((state) => {
    const t      = state.clock.elapsedTime
    const scroll = scrollRef.current
    const mx     = mouse.current[0]
    const my     = mouse.current[1]

    const cycle = (t % 4.2) / 4.2
    cycleRef.current = cycle

    const TRAVEL = -0.85
    let tipY = 0
    let contactStrength = 0

    if (cycle < 0.375) {
      const p = cycle / 0.375
      tipY = TRAVEL * (p * p)
      contactStrength = p > 0.85 ? (p - 0.85) / 0.15 : 0
    } else if (cycle < 0.5) {
      tipY = TRAVEL;  contactStrength = 1
    } else if (cycle < 0.75) {
      const p = (cycle - 0.5) / 0.25
      const eased = 1 - Math.pow(1 - p, 2)
      tipY = TRAVEL * (1 - eased)
      contactStrength = Math.max(0, 1 - p * 1.6)
    }

    if (tipRef.current) tipRef.current.position.y = tipY

    if (indentRef.current) {
      let s = 0.001
      if (cycle < 0.375)      s = 0.001 + (cycle / 0.375) * 0.999
      else if (cycle < 0.5)   s = 1
      else if (cycle < 0.75)  s = 1 - (cycle - 0.5) / 0.25 * 0.35
      else                    s = 0.65 * Math.max(0, 1 - (cycle - 0.75) / 0.25)
      indentRef.current.scale.setScalar(s)
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = contactStrength * 0.42
      const gs = 0.5 + contactStrength * 1.6
      glowRef.current.scale.setScalar(gs)
    }

    ringRefs.forEach((ref, i) => {
      if (!ref.current) return
      const delay = i * 0.08
      const phase = (cycle - 0.37 - delay + 1) % 1
      if (phase >= 0 && phase < 0.35) {
        const p = phase / 0.35
        ref.current.scale.setScalar(1 + p * 10)
        ref.current.material.opacity = (1 - p) * 0.55
      } else {
        ref.current.material.opacity = 0
      }
    })

    /* 3/4-view base orientation + mouse parallax */
    if (innerRef.current) {
      const tRX = -my * 0.06 - 0.18
      const tRY =  mx * 0.14 - 0.22
      innerRef.current.rotation.x += (tRX - innerRef.current.rotation.x) * 0.035
      innerRef.current.rotation.y += (tRY - innerRef.current.rotation.y) * 0.035
    }
    if (outerRef.current) {
      outerRef.current.position.y = THREE.MathUtils.lerp(-0.1, -0.45, scroll)
    }
  })

  const xPos  = isNarrow ? 0    : 2.3
  const scale = isTiny  ? 0.62 : isNarrow ? 0.75 : 0.95

  return (
    <group ref={outerRef} position={[xPos, -0.1, 0]} scale={scale}>
      <group ref={innerRef}>
        <ProbeAssembly tipRef={tipRef} />
        <SampleSurface
          indentRef={indentRef}
          ringRefs={ringRefs}
          glowRef={glowRef}
          useReflection={!isNarrow}
        />
        {!isNarrow && <ForceDepthChart cycleRef={cycleRef} />}

        {/* Soft contact shadow under sample */}
        <ContactShadows
          position={[0, -1.08, 0]}
          opacity={0.4}
          scale={4}
          blur={2.6}
          far={1.5}
          resolution={256}
          color="#0f172a"
        />
      </group>
    </group>
  )
}

/* ==================================================================
   Scene root
================================================================== */
export default function NanoindenterScene({ mouse, scrollRef }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 8, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-5, 3, 2]} intensity={0.55} color="#dbeafe" />
      <pointLight position={[2, 2, 3]}  intensity={0.95} color="#60a5fa" />
      <pointLight position={[-2, 1, 2]} intensity={0.4}  color="#a78bfa" />

      <IndenterRig mouse={mouse} scrollRef={scrollRef} />
    </>
  )
}
