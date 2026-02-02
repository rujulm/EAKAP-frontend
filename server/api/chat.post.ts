import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ query?: string }>(event)

  return {
    answer: `Mock response for: ${body?.query ?? ''}`
  }
})