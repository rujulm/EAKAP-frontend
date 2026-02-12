import type { H3Event } from 'h3'

const SESSION_COOKIE_NAME = 'sid'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

export interface Session {
	user_id: string
	access_token: string
	refresh_token: string
	expires_at?: number
}

const sessions = new Map<string, Session>()

function getSessionId(event: H3Event): string | null {
	return getCookie(event, SESSION_COOKIE_NAME) ?? null
}

export function getAppSession(event: H3Event): Session | null {
	const sid = getSessionId(event)
	if (!sid) return null
	const session = sessions.get(sid)
	if (!session) return null
	if (session.expires_at && session.expires_at < Date.now()) {
		sessions.delete(sid)
		return null
	}
	return session
}

export function requireAppSession(event: H3Event): Session {
	const session = getAppSession(event)
	if (!session) {
		throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
	}
	return session
}

export function createSession(event: H3Event, data: Session): string {
	const sid = crypto.randomUUID()
	sessions.set(sid, data)
	const isProd = process.env.NODE_ENV === 'production'
	setCookie(event, SESSION_COOKIE_NAME, sid, {
		httpOnly: true,
		secure: isProd,
		sameSite: 'lax',
		maxAge: SESSION_MAX_AGE,
		path: '/'
	})
	return sid
}

export function destroySession(event: H3Event): void {
	const sid = getSessionId(event)
	if (sid) sessions.delete(sid)
	deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
}
