import type { H3Event } from 'h3'
import { getQuery, readBody } from 'h3'

export interface ProxyOptions {
	path: string
	method?: 'GET' | 'POST'
	body?: unknown
	query?: Record<string, string | undefined>
	token?: string | null
}

export async function proxyToBackend(event: H3Event, options: ProxyOptions): Promise<unknown> {
	const config = useRuntimeConfig()
	const baseUrl = (config.apiBaseUrl as string)?.replace(/\/$/, '') ?? ''
	const { path, method = 'GET', body, query: queryOverride, token } = options

	const pathQuery = queryOverride ?? (method === 'GET' ? getQuery(event) : {})
	const search = new URLSearchParams()
	for (const [k, v] of Object.entries(pathQuery)) {
		if (v !== undefined && v !== null && v !== '') search.set(k, String(v))
	}
	const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}${search.toString() ? `?${search}` : ''}`

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	}
	if (token) headers['Authorization'] = `Bearer ${token}`

	const init: RequestInit = { method, headers }
	if (method === 'POST' && body !== undefined) {
		init.body = typeof body === 'string' ? body : JSON.stringify(body)
	} else if (method === 'POST' && !queryOverride) {
		try {
			init.body = JSON.stringify(await readBody(event) ?? {})
		} catch {
			// no body
		}
	}

	const response = await fetch(url, init)

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

	if (response.status === 204) return undefined
	const contentType = response.headers.get('content-type') ?? ''
	const isJson = contentType.includes('application/json')
	if (!response.body || response.bodyUsed) return undefined
	return isJson ? response.json() : response.text()
}
