import { readMultipartFormData, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'No form data received' })

  const file = formData.find((f) => f.name === 'file')
  if (!file || !file.filename) throw createError({ statusCode: 400, statusMessage: 'File missing' })

  const globalAny = globalThis as any
  globalAny.__docs = globalAny.__docs || []

  const newDoc = {
    id: String(Date.now()),
    name: file.filename,
    uploadedAt: Date.now()
  }

  globalAny.__docs.unshift(newDoc)

  return { ok: true, document: newDoc }
})
