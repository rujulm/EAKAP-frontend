const OAUTH_CLIENT_ID = 'eakap-frontend'

const STORAGE_KEYS = {
  accessToken: 'eakap_access_token',
  refreshToken: 'eakap_refresh_token',
  expiresAt: 'eakap_expires_at'
} as const

function isClient(): boolean {
  return typeof window !== 'undefined'
}

function persistToStorage(access: string | null, refresh: string | null, expiresAt: number | null): void {
  if (!isClient()) return
  if (access) localStorage.setItem(STORAGE_KEYS.accessToken, access)
  else localStorage.removeItem(STORAGE_KEYS.accessToken)
  if (refresh) localStorage.setItem(STORAGE_KEYS.refreshToken, refresh)
  else localStorage.removeItem(STORAGE_KEYS.refreshToken)
  if (expiresAt) localStorage.setItem(STORAGE_KEYS.expiresAt, String(expiresAt))
  else localStorage.removeItem(STORAGE_KEYS.expiresAt)
}

function clearStorage(): void {
  if (!isClient()) return
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.expiresAt)
}

function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  const random = new Uint8Array(length)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(random)
    for (let i = 0; i < length; i++) result += chars[random[i]! % chars.length]
  } else {
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function pkceChallenge(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = randomString(64)
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const codeChallenge = base64UrlEncode(digest)
  return { codeVerifier, codeChallenge }
}

export type User = {
  id: string
  email: string
  tenant_id: string
  is_active: boolean
}

export type UserRegisterPayload = {
  email: string
  password: string
  tenant_id: string
  dept: string
  project: string
  clearance: number
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const refreshToken = useState<string | null>('auth-refresh-token', () => null)
  const expiresAt = useState<number | null>('auth-expires-at', () => null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function clearAuth() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    expiresAt.value = null
    clearStorage()
  }

  /** Refresh access token using refresh_token grant; updates state and storage. Returns true on success. */
  async function refreshTokens(): Promise<boolean> {
    const refresh = refreshToken.value
    if (!refresh) return false
    try {
      const tokenRes = await $fetch<{ access_token: string; refresh_token: string; expires_in: number }>('/api/auth/token', {
        method: 'POST',
        body: {
          grant_type: 'refresh_token',
          refresh_token: refresh,
          client_id: OAUTH_CLIENT_ID
        }
      })
      const at = tokenRes.access_token
      const rt = tokenRes.refresh_token
      const exp = tokenRes.expires_in ? Date.now() + tokenRes.expires_in * 1000 : null
      accessToken.value = at
      refreshToken.value = rt
      expiresAt.value = exp
      persistToStorage(at, rt, exp)
      return true
    } catch {
      clearAuth()
      return false
    }
  }

  async function fetchUser(): Promise<User | null> {
    const token = accessToken.value
    const exp = expiresAt.value
    const refresh = refreshToken.value
    if (refresh && (!token || (exp && Date.now() > exp))) {
      const ok = await refreshTokens()
      if (!ok) return null
    }
    const currentToken = accessToken.value
    if (!currentToken) return null
    try {
      const data = await $fetch<User>('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
      user.value = data
      return data
    } catch (e: unknown) {
      const err = e as { statusCode?: number }
      if (err.statusCode === 401) {
        const ok = await refreshTokens()
        if (ok) return fetchUser()
        clearAuth()
      }
      return null
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const { codeVerifier, codeChallenge } = await pkceChallenge()
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/chat` : 'http://localhost:3000/chat'
    const loginRes = await $fetch<{ code: string; state?: string | null }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      query: {
        client_id: OAUTH_CLIENT_ID,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: null
      }
    })
    const tokenRes = await $fetch<{ access_token: string; refresh_token: string; expires_in: number }>('/api/auth/token', {
      method: 'POST',
      body: {
        grant_type: 'authorization_code',
        code: loginRes.code,
        code_verifier: codeVerifier,
        client_id: OAUTH_CLIENT_ID
      }
    })
    const at = tokenRes.access_token
    const rt = tokenRes.refresh_token
    const exp = tokenRes.expires_in ? Date.now() + tokenRes.expires_in * 1000 : null
    accessToken.value = at
    refreshToken.value = rt
    expiresAt.value = exp
    persistToStorage(at, rt, exp)
    await fetchUser()
  }

  async function register(payload: UserRegisterPayload): Promise<void> {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: payload
    })
  }

  async function logout(): Promise<void> {
    const token = refreshToken.value
    if (token) {
      try {
        await $fetch('/api/auth/token/revoke', {
          method: 'POST',
          body: { token }
        })
      } catch {
        // best-effort revoke
      }
    }
    clearAuth()
  }

  /** Client-only: restore session from localStorage; refresh if expired; fetch user. */
  async function restoreSession(): Promise<void> {
    if (!isClient()) return
    const storedAccess = localStorage.getItem(STORAGE_KEYS.accessToken)
    const storedRefresh = localStorage.getItem(STORAGE_KEYS.refreshToken)
    const storedExpires = localStorage.getItem(STORAGE_KEYS.expiresAt)
    if (storedAccess) accessToken.value = storedAccess
    if (storedRefresh) refreshToken.value = storedRefresh
    if (storedExpires) {
      const exp = Number(storedExpires)
      if (!Number.isNaN(exp)) expiresAt.value = exp
    }
    const refresh = refreshToken.value
    const now = Date.now()
    const expired = expiresAt.value != null && now > expiresAt.value
    if (refresh && (!accessToken.value || expired)) {
      const ok = await refreshTokens()
      if (!ok) return
    }
    if (accessToken.value) await fetchUser()
  }

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    clearAuth,
    restoreSession,
    refreshTokens
  }
}
