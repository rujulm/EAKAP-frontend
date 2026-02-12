import type { UserLogin } from '~/types/api'
import { getQuery, readBody } from 'h3'
import { proxyToBackend } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
	const body = await readBody<UserLogin>(event)
	const query = getQuery(event) as Record<string, string | undefined>
	return proxyToBackend(event, {
		path: '/auth/login',
		method: 'POST',
		body,
		query: {
			client_id: query.client_id,
			redirect_uri: query.redirect_uri,
			code_challenge: query.code_challenge,
			code_challenge_method: query.code_challenge_method ?? 'S256',
			state: query.state
		}
	})
})
