import { requireAppSession } from '~/server/utils/session'
import { proxyToBackend } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
	const session = requireAppSession(event)
	return proxyToBackend(event, {
		path: '/auth/me',
		method: 'GET',
		token: session.access_token
	})
})
