/**
 * Technical FAQ knowledge (from Industron's Frequently Asked Questions page).
 * Retrieved per-question and fed into the support chat so it can answer
 * nanoindentation / instrumentation questions accurately.
 * Source: https://industronnano.com/frequently-asked-questions-faq/
 */

export const TECHNICAL_FAQ = [
  {
    id: 'tip-selection',
    question: 'Tip / probe selection guide (Berkovich, Cube Corner, Cono-Spherical)',
    answer:
      'Three standard nanoindentation probe geometries are commonly used. ' +
      'Berkovich tip: three-sided pyramidal indenter with an included angle of 142.35° and a typical tip radius of ~120–150 nm; best for bulk metals, ceramics, glass, hard polymers, and hard biological materials (bone, teeth); the standard choice for hardness and modulus. ' +
      'Cube Corner tip: sharper three-sided pyramid with a 90° included angle and a typical tip radius <40 nm; best for ultra-thin films (<100 nm), micro/nanocomposites, fracture-toughness studies, and nanostructured materials; produces plastic deformation at much smaller loads. ' +
      'Cono-Spherical tip: conical indenter with a spherical end, available in 60°, 90°, and 120° cone angles; best for scratch testing, soft materials, compression experiments, and contact-mechanics studies.',
    keywords:
      'tip probe selection guide geometry berkovich cube corner cono conospherical conical spherical pyramid indenter included angle radius which tip should i use hardness modulus scratch soft',
  },
  {
    id: 'min-depth-berkovich',
    question: 'What is the minimum depth at which hardness can be measured with a Berkovich probe?',
    answer:
      'The minimum reliable hardness depth depends on the tip radius. At shallow depths the rounded tip dominates the contact area instead of the ideal Berkovich geometry, so measurements become unreliable when the contact depth approaches roughly R/3 (R = tip radius). ' +
      'Example: for a typical Berkovich tip radius of 120 nm, reliable hardness should generally be measured above ~40 nm depth. For shallower measurements, use a sharper probe such as a Cube Corner or NorthStar® tip.',
    keywords:
      'minimum depth hardness berkovich probe tip radius r/3 shallow reliable 40 nm 120 nm shallow depth cube corner northstar sharper probe how shallow',
  },
  {
    id: 'fracture-toughness',
    question: 'Can we measure fracture toughness using nanoindentation, and which tip should be used?',
    answer:
      'Yes. Fracture toughness can be measured by combining nanoindentation with in-situ Scanning Probe Microscopy (SPM). The method: (1) induce cracks in a brittle material, (2) measure the force required to initiate cracking, (3) measure crack lengths using SPM imaging, and (4) calculate fracture toughness using established fracture-mechanics equations. ' +
      'A Cube Corner indenter is generally preferred because its sharper geometry promotes crack initiation at lower loads.',
    keywords:
      'fracture toughness nanoindentation spm crack cracking cube corner tip brittle crack length fracture mechanics can we measure which tip',
  },
  {
    id: 'dynamic-nanoindentation',
    question: 'What is dynamic nanoindentation?',
    answer:
      'Dynamic nanoindentation (force modulation) improves on conventional quasi-static Oliver–Pharr testing. Instead of only a static load, a small sinusoidal (AC) force is superimposed on the static (DC) force; the system measures AC displacement and phase shift, and contact stiffness is calculated continuously throughout the test. ' +
      'Advantages: continuous stiffness measurement, lower sensitivity to thermal drift, accurate creep measurement, and measurement of viscoelastic properties — well suited to polymers and soft materials. Measurements are typically performed at frequencies above 40 Hz.',
    keywords:
      'dynamic nanoindentation force modulation ac dc sinusoidal continuous stiffness cmx nanodma oliver pharr quasi-static phase shift viscoelastic creep drift 40 hz frequency what is dynamic',
  },
  {
    id: 'noise-floor',
    question: 'What is noise floor, and why is resolution not the real parameter for precise force/displacement measurement?',
    answer:
      'Noise floor represents the total unwanted signal in the measurement system and determines the smallest force or displacement that can actually be measured with confidence. ' +
      'Resolution refers only to the smallest digital increment produced by the electronics and depends on the number of bits in the data-acquisition system (resolution scales as 2^n, where n = number of bits). ' +
      'Because of this, high resolution does not guarantee accurate measurements — a low noise floor is far more important for precise nanoindentation of force and displacement.',
    keywords:
      'noise floor resolution precision precise force displacement bits data acquisition 2^n digital increment unwanted signal accuracy why resolution not real parameter',
  },
  {
    id: 'thin-film-substrate',
    question: 'Which is the most efficient method to investigate a thin film / substrate system?',
    answer:
      'The recommended approach is nanoDMA III with CMX algorithms. CMX provides continuous measurement of hardness, storage modulus, loss modulus, complex modulus, and tan δ as functions of depth, frequency, and time. ' +
      'The major challenge in thin-film testing is the substrate effect: as indentation depth increases, the elastic deformation zone extends into the substrate and measured properties become a mix of film and substrate. CMX enables detection of substrate influence, continuous depth-dependent property measurement, and improved thin-film characterization.',
    keywords:
      'thin film substrate system efficient method nanodma iii cmx continuous hardness storage loss complex modulus tan delta depth frequency time substrate effect deformation zone coating',
  },
  {
    id: 'surface-roughness',
    question: 'What is the effect of surface roughness on instrumented hardness measurements?',
    answer:
      'Surface roughness significantly affects nanoindentation because the contact area is calculated indirectly from indentation depth, so a rough surface introduces errors in the true contact area. Roughness is characterized by the parameter α = (σs · R) / a², where σs is the maximum asperity height, R is the indenter radius, and a is the contact radius. ' +
      'Roughness effects increase with larger indenter radius and at lower loads; Berkovich indenters (≈100 nm tip radius) are less affected than spherical indenters. Per ISO 14577-4, the average surface roughness Ra should be less than 5% of the indentation depth at which properties are measured to obtain repeatable results.',
    keywords:
      'surface roughness effect instrumented hardness contact area asperity indenter radius alpha ra iso 14577-4 5 percent repeatable spherical berkovich rough sample preparation polishing',
  },
]

const FAQ_STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'what', 'which', 'how', 'does', 'can',
  'you', 'your', 'why', 'this', 'that', 'are', 'was', 'were', 'its', 'their',
  'measure', 'measured', 'use', 'used', 'using', 'about', 'any', 'when', 'should',
])

function tokenize(query) {
  return String(query || '')
    .toLowerCase()
    .replace(/[μµ]/g, 'u')
    .replace(/[δ]/g, 'delta')
    .split(/[^a-z0-9+-]+/)
    .filter((t) => t.length > 2 && !FAQ_STOPWORDS.has(t))
}

/** Retrieve the technical-FAQ entries most relevant to a query. */
export function retrieveRelevantFaq(query, k = 2) {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  return TECHNICAL_FAQ.map((f) => {
    const q = f.question.toLowerCase()
    const kw = f.keywords.toLowerCase()
    const ans = f.answer.toLowerCase()
    let score = 0
    tokens.forEach((t) => {
      const stem = t.replace(/(ies|es|s)$/, '')
      const hit = (s) => s.includes(t) || (stem.length > 2 && s.includes(stem))
      // Weight the question highest, then keywords, then answer body.
      if (hit(q)) score += 3
      else if (hit(kw)) score += 2
      else if (hit(ans)) score += 1
    })
    return { f, score }
  })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.f)
}

/** Compact list of FAQ questions (for discovery / "what can you answer"). */
export function buildFaqQuestionList() {
  return TECHNICAL_FAQ.map((f) => `• ${f.question}`).join('\n')
}
