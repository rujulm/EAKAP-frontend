import { readBody, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ query?: string }>(event)
  const auth = getHeader(event, 'authorization')

  const res = await $fetch<Record<string, unknown>>(`${config.backendUrl}/chat/ask`, {
    method: 'POST',
    body: {
      query: body?.query ?? '',
      threshold: 1.5,
      top_k: 2
    },
    headers: auth ? { Authorization: auth } : {}
  }).catch((err: { statusCode?: number; statusMessage?: string; data?: unknown; message?: string }) => {
    throw createError({
      statusCode: err.statusCode ?? 502,
      statusMessage: err.statusMessage ?? 'Backend error',
      data: err.data ?? err.message
    })
  })

  const answer = (res as { answer?: string; response?: string }).answer ?? (res as { answer?: string; response?: string }).response
  return { answer: answer ?? '' }
})
