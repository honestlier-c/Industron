/**
 * Product brochure PDFs (public/Brochure/).
 * Used by product detail CTAs, brochure form download, and the flipbook viewer.
 */
export const BROCHURE_BASE = '/Brochure'

export const BROCHURE_FILES = {
  mesoprobe: `${BROCHURE_BASE}/Mesoprobe.pdf`,
  'uprobe-500': `${BROCHURE_BASE}/Muprobe.pdf`,
  ng80: `${BROCHURE_BASE}/NG80.pdf`,
}

export function getBrochureUrl(slug) {
  return BROCHURE_FILES[slug] || null
}
