/** Product slug → brochure PDF under private/Brochure/ */

export const BROCHURE_FILES = {
  mesoprobe: { file: 'Mesoprobe.pdf', label: 'MesoProbe' },
  'uprobe-500': { file: 'Muprobe.pdf', label: 'μProbe 500' },
  ng80: { file: 'NG80.pdf', label: 'NG80' },
}

export function resolveBrochure(slug) {
  const key = String(slug || '').toLowerCase()
  const hit = BROCHURE_FILES[key]
  if (!hit) return null
  return { slug: key, ...hit }
}

export const PRODUCT_LABELS = {
  'uprobe-500': 'μProbe 500',
  mesoprobe: 'MesoProbe',
  ng80: 'NG80',
  'pneumatic-air-isolation-table': 'Pneumatic Air Isolation Table',
  'dic-software': 'DIC Software',
}
