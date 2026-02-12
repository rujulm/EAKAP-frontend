import type { QueryRequest } from '~/types/api'
import { requireAppSession } from '~/server/utils/session'
import { setResponseHeaders, setResponseStatus, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
	const session = requireAppSession(event)
	const body = await readBody<QueryRequest>(event)
	if (!body?.query) {
		throw createError({
			statusCode: 422,
			statusMessage: 'Validation Error',
			message: 'query is required'
		})
	}

	const config = useRuntimeConfig()
	const baseUrl = (config.apiBaseUrl as string)?.replace(/\/$/, '') ?? ''
	const url = `${baseUrl}/chat/ask`

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.access_token}`
		},
		body: JSON.stringify({
			query: body.query,
			threshold: body.threshold ?? 1.5,
			top_k: body.top_k ?? 2
		})
	})

	if (!response.ok) {
		const contentType = response.headers.get('content-type') ?? ''
		const isJson = contentType.includes('application/json')
		const data = isJson ? await response.json().catch(() => ({})) : await response.text()
		throw createError({
			statusCode: response.status,
			statusMessage: response.statusText,
			data
		})
	}

	setResponseStatus(event, 200)
	setResponseHeaders(event, {
		'Content-Type': response.headers.get('content-type') || 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	})

	const stream = response.body
	if (!stream) {
		return
	}
	await sendStream(event, stream)
})
