import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  try {
    return await $fetch(`${config.backendUrl}/auth/token`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; data?: unknown }
    throw createError({
      statusCode: e.statusCode ?? 502,
      statusMessage: e.statusMessage ?? 'Backend error',
      data: e.data
    })
  }
})
