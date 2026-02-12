import type { TokenRevokeRequest } from '~/types/api'
import { destroySession } from '~/server/utils/session'
import { proxyToBackend } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
	const body = await readBody<TokenRevokeRequest>(event)
	await proxyToBackend(event, {
		path: '/auth/token/revoke',
		method: 'POST',
		body
	})
	destroySession(event)
	return undefined
})
