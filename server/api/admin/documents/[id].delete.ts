import { getRouterParam, createError } from 'h3'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const globalAny = globalThis as any
  globalAny.__docs = globalAny.__docs || []

  const before = globalAny.__docs.length
  globalAny.__docs = globalAny.__docs.filter((d: any) => d.id !== id)

  if (globalAny.__docs.length === before) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  return { ok: true }
})
