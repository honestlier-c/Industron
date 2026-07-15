/**
 * Single source of truth for the /applications page AND the chat knowledge base.
 * Application-note PDFs live in public/PDF (served at /PDF/<file>).
 */

export const PDF_BASE = '/PDF'
const PDF = PDF_BASE

export const APPLICATION_INDUSTRIES = [
  {
    title: 'Steel Industry',
    accent: 'cyan',
    techniques: ['Nanoindentation & Tribology', 'Property Mapping', 'Scanning Probe Microscopy'],
    notes: [
      { label: 'Investigating wear and nanomechanics of thin hard coatings on steel', pdf: `${PDF}/Steel-Investigating-Wear-and-Nanomechanics-of-Thin-Hard-Coatings-on-Steel.pdf` },
      { label: 'Correlative microscopy and XPM steel', pdf: `${PDF}/Correlative-Microscopy-and-XPM.pdf` },
      { label: 'Local work hardening of steel', pdf: `${PDF}/Local-Work-Hardening-of-Steel.pdf` },
      { label: 'Oxide dispersion strengthened steel tested up to 700°C', pdf: `${PDF}/Oxide-Dispersion-Strengthened-Steel-Tested-up-to-700C.pdf` },
      { label: 'Hardness mapping of a DP980 steel sample', pdf: `${PDF}/Hardness-Mapping-of-a-DP980-Steel-Sample.pdf` },
      { label: 'Nanoindentation of duplex stainless steel using EBSD and PI 88', pdf: `${PDF}/Nanoindentation-of-Duplex-Stainless-Steel-Using-EBSD-and-PI-88.pdf` },
    ],
  },
  {
    title: 'Foundry, Metal Forming & Joining',
    accent: 'purple',
    techniques: ['Nanoindentation & Tribology', 'Property Mapping', 'Scanning Probe Microscopy'],
    notes: [
      { label: 'Targeted nanoindentation of a high entropy alloy in SEM', pdf: `${PDF}/Targeted-Nanoindentation-of-a-High-Entropy-Alloy-in-the-SEM.pdf` },
      { label: 'Material joining characterization of laser beam welding', pdf: `${PDF}/Material-Joining-Characterization-of-Laser-Beam-Welding.pdf` },
    ],
  },
  {
    title: 'Pharmaceutical',
    accent: 'cyan',
    techniques: ['Mechanical properties of molecular crystals', 'Property mapping'],
    notes: [
      { label: 'Indentation-induced structural changes using Raman spectroscopy', pdf: `${PDF}/Indentation-Induced-Structural-Changes-Probed-by-Raman-Spectroscopy.pdf` },
    ],
  },
  {
    title: 'Automotive & Aerospace',
    accent: 'purple',
    techniques: [
      'Nanoindentation & Nanotribology',
      'High-temperature property mapping',
      'Scanning Probe Microscopy',
      'Creep testing',
    ],
    notes: [
      { label: 'Tape test vs nanoindentation', pdf: `${PDF}/Tape-Test-versus-Nanoindentation.pdf` },
      { label: 'Polymer thin film characterization at low temperature', pdf: `${PDF}/Polymer-Thin-Film-Characterization-at-Cold-Temperature.pdf` },
      { label: 'Strength engineering in nickel-based superalloys', pdf: `${PDF}/Strength-Engineering-in-a-Nickel-Base-Superalloy.pdf` },
      { label: 'Tire materials testing in harsh environments', pdf: `${PDF}/Tire-Materials-Testing-for-Harsh-Environments.pdf` },
      { label: 'High-temperature creep testing of superalloy bond coat', pdf: `${PDF}/High-Temperature-Creep-Testing-of-a-Superalloy-Bond-Coat.pdf` },
      { label: 'In-situ high-temperature study of Ni-based superalloys', pdf: `${PDF}/In-Situ-High-Temp-Study-of-Ni-Based-Superalloy-and-PtNiAl-Bond-Coat.pdf` },
    ],
  },
  {
    title: 'Food & Beverages',
    accent: 'cyan',
    techniques: [
      'Adhesion strength of thin coatings',
      'Mechanical characterization of corrosion-resistant coatings',
      'Wear testing',
    ],
    notes: [
      { label: 'Mechanical characterization of corrosion-resistant coatings', pdf: `${PDF}/Mechanical-Characterization-of-Corrosion-Resistant-Coatings.pdf` },
    ],
  },
  {
    title: 'Surface Protection & Paint Coatings',
    accent: 'purple',
    techniques: [
      'Adhesion strength of coatings',
      'Depth-dependent property measurement',
      'Thin film measurement (as low as 1 nm)',
    ],
    notes: [
      { label: 'Polymer thin film characterization', pdf: `${PDF}/Polymer-Thin-Film-Characterization-at-Cold-Temperature.pdf` },
      { label: 'Corrosion-resistant coating analysis', pdf: `${PDF}/Mechanical-Characterization-of-Corrosion-Resistant-Coatings.pdf` },
      { label: 'Tape test vs nanoindentation', pdf: `${PDF}/Tape-Test-versus-Nanoindentation.pdf` },
    ],
  },
  {
    title: 'Biomaterials',
    accent: 'cyan',
    techniques: [
      'Nanoindentation & Tribology',
      'Viscoelastic property measurement',
      'Dynamic Mechanical Analysis',
    ],
    notes: [
      { label: 'Indentation of contact lenses', pdf: `${PDF}/Indentation-of-Contact-Lenses.pdf` },
      { label: 'Hydrogel characterization using in-situ indenter', pdf: `${PDF}/Mechanical-Characterization-of-Hydrogels-Using-the-Hysitron-BioSoft-In-Situ-Indenter.pdf` },
      { label: 'Raman and indentation mapping of biological tissues', pdf: `${PDF}/Raman-and-Indentation-Mapping-of-a-Rat-Tooth.pdf` },
      { label: 'Compression testing of living cells', pdf: `${PDF}/Compression-Test-of-a-Living-Cell.pdf` },
      { label: 'Characterization of aortic valve tissue', pdf: `${PDF}/Highly-Localized-Characterization-of-Aortic-Valve-Tissue.pdf` },
      { label: 'Nanoindentation of marine teeth', pdf: `${PDF}/Nanoindentation-of-Marine-Teeth.pdf` },
      { label: 'Elastic properties of cartilage tissue', pdf: `${PDF}/Elastic-Properties-of-Cartilage-Tissue.pdf` },
    ],
  },
  {
    title: 'Polymer & Plastic',
    accent: 'purple',
    techniques: [
      'Dynamic Mechanical Analysis (DMA)',
      'Time/frequency-dependent behavior',
      'Temperature sweep & glass transition analysis',
    ],
    notes: [
      { label: 'Polymer thin film characterization', pdf: `${PDF}/Polymer-Thin-Film-Characterization-at-Cold-Temperature.pdf` },
      { label: 'Tire materials testing', pdf: `${PDF}/Tire-Materials-Testing-for-Harsh-Environments.pdf` },
      { label: 'High-throughput material screening', pdf: `${PDF}/High-Throughput-Material-Screening-by-nanoDMA-III.pdf` },
      { label: 'Time-dependent deformation of PMMA', pdf: `${PDF}/Time-Dependent-Deformation-Behavior-of-PMMA.pdf` },
    ],
  },
]

export const TESTING_TECHNIQUES = [
  {
    title: 'Nanoindentation',
    desc: 'Mechanical testing to measure hardness and modulus at the nanoscale by applying force and measuring indentation depth.',
  },
  {
    title: 'Scanning Probe Microscopy (SPM)',
    desc: 'Nanometer-resolution 3D surface imaging through raster scanning. Enables precise site-specific testing (~±10 nm accuracy).',
  },
  {
    title: 'NanoScratch',
    desc: 'Measures scratch resistance, adhesion, friction, and coating behavior using force-displacement monitoring.',
  },
  {
    title: 'Scanning Wear',
    desc: 'Evaluates wear rate and volume at sub-microstructural levels with in-situ imaging capability.',
  },
  {
    title: 'High Temperature Testing',
    desc: 'Material characterization up to 800 °C, enabling analysis under extreme operating conditions.',
  },
  {
    title: 'Creep Testing',
    desc: 'Measures time-dependent deformation of materials under load, even at elevated temperatures.',
  },
  {
    title: 'Modulus Mapping',
    desc: 'DMA-based technique that maps stiffness, modulus, and viscoelastic properties across surfaces.',
  },
  {
    title: 'Dynamic Mechanical Analysis (DMA)',
    desc: 'Analyzes viscoelastic materials by applying sinusoidal forces to study time-dependent mechanical behavior.',
  },
  {
    title: 'Accelerated Property Mapping (XPM)',
    desc: 'Rapid large-scale mapping of mechanical properties with multiple indentations per second.',
  },
]

/** Flat, de-duplicated list of application notes: { label, pdf, industries[] }. */
export function getApplicationNotes() {
  const byPdf = new Map()
  for (const ind of APPLICATION_INDUSTRIES) {
    for (const note of ind.notes) {
      const existing = byPdf.get(note.pdf)
      if (existing) {
        if (!existing.industries.includes(ind.title)) existing.industries.push(ind.title)
      } else {
        byPdf.set(note.pdf, {
          label: note.label,
          pdf: note.pdf,
          industries: [ind.title],
        })
      }
    }
  }
  return [...byPdf.values()]
}
