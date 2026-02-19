import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const auth = getHeader(event, 'authorization')
  try {
    return await $fetch(`${config.backendUrl}/auth/me`, {
      method: 'GET',
      headers: auth ? { Authorization: auth } : {}
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
