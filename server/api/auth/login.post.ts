import { readBody, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const query = getQuery(event)
  try {
    return await $fetch(`${config.backendUrl}/auth/login`, {
      method: 'POST',
      body,
      query: {
        client_id: query.client_id,
        redirect_uri: query.redirect_uri,
        code_challenge: query.code_challenge,
        code_challenge_method: query.code_challenge_method ?? 'S256',
        state: query.state
      },
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
