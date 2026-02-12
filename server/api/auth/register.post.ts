import type { UserRegister } from '~/types/api'
import { proxyToBackend } from '~/server/utils/proxy'

export default defineEventHandler(async (event) => {
	const body = await readBody<UserRegister>(event)
	return proxyToBackend(event, {
		path: '/auth/register',
		method: 'POST',
		body
	})
})
