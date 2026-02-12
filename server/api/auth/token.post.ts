import type { TokenRequest, TokenResponse, UserResponse } from '~/types/api'
import { createSession } from '~/server/utils/session'
import { proxyToBackend } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
	const body = await readBody<TokenRequest>(event)
	const tokenResponse = await proxyToBackend(event, {
		path: '/auth/token',
		method: 'POST',
		body
	}) as TokenResponse

	// Create session: get user_id from /auth/me, then store session and set cookie
	const config = useRuntimeConfig()
	const baseUrl = (config.apiBaseUrl as string)?.replace(/\/$/, '') ?? ''
	const meRes = await fetch(`${baseUrl}/auth/me`, {
		headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
	})
	if (!meRes.ok) {
		throw createError({
			statusCode: meRes.status,
			statusMessage: 'Failed to fetch user after token exchange'
		})
	}
	const user = (await meRes.json()) as UserResponse

	createSession(event, {
		user_id: user.id,
		access_token: tokenResponse.access_token,
		refresh_token: tokenResponse.refresh_token
	})

	return tokenResponse
})
