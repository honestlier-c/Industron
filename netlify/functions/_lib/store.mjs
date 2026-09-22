import { getStore } from '@netlify/blobs'

const STORE = 'brochure-requests'

function store(context) {
  return getStore({ name: STORE, consistency: 'strong', context })
}

export async function saveRequest(context, id, data) {
  await store(context).setJSON(id, data)
}

export async function getRequest(context, id) {
  return store(context).getJSON(id)
}

export async function updateRequest(context, id, patch) {
  const current = (await getRequest(context, id)) || {}
  const next = { ...current, ...patch }
  await saveRequest(context, id, next)
  return next
}
