export type DocItem = {
  id: string
  name: string
  uploadedAt: number
}

const globalAny = globalThis as any
globalAny.__docs = globalAny.__docs || [
  { id: '1', name: 'HR Policy.pdf', uploadedAt: Date.now() - 86400000 },
  { id: '2', name: 'Annual Report 2025.pdf', uploadedAt: Date.now() - 3600000 }
]

export default defineEventHandler(() => {
  return { documents: globalAny.__docs as DocItem[] }
})
