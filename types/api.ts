// Auth
export interface UserRegister {
	email: string
	password: string
	tenant_id: string
	dept: string
	project: string
	clearance: number
}

export interface UserLogin {
	email: string
	password: string
}

export interface UserResponse {
	id: string
	email: string
	tenant_id: string
	is_active: boolean
}

export interface AuthorizeResponse {
	code: string
	state?: string | null
}

export interface TokenRequest {
	grant_type: string
	client_id: string
	code?: string | null
	code_verifier?: string | null
	refresh_token?: string | null
}

export interface TokenResponse {
	access_token: string
	refresh_token: string
	token_type?: string
	expires_in: number
}

export interface TokenRevokeRequest {
	token: string
	token_type_hint?: string | null
}

// Chat
export interface QueryRequest {
	query: string
	threshold?: number
	top_k?: number
}

// Validation errors
export interface ValidationError {
	loc: (string | number)[]
	msg: string
	type: string
	input?: unknown
	ctx?: Record<string, unknown>
}

export interface HTTPValidationError {
	detail?: ValidationError[]
}
