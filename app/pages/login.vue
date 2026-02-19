<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Sign in</h1>
      <p class="auth-subtitle">Sign in to use the chat and admin</p>
      <form @submit.prevent="submit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="input"
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="auth-footer">
        Don't have an account?
        <NuxtLink to="/register" class="link">Register</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const router = useRouter()
const { login, isAuthenticated } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await router.push('/chat')
  } catch (e: unknown) {
    const err = e as { data?: { detail?: string | Array<{ msg?: string }> }; statusCode?: number }
    if (err.data?.detail) {
      error.value = Array.isArray(err.data.detail)
        ? err.data.detail.map((d) => d.msg ?? '').join(', ')
        : String(err.data.detail)
    } else {
      error.value = 'Sign in failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isAuthenticated.value) router.push('/chat')
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.auth-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}
.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
}
.auth-subtitle {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.form-group label {
  font-size: 0.875rem;
  color: #e2e8f0;
}
.input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
}
.input::placeholder {
  color: #6b7280;
}
.input:focus {
  border-color: #3b82f6;
}
.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
}
.submit-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.auth-footer {
  margin: 1.5rem 0 0 0;
  font-size: 0.875rem;
  color: #9ca3af;
}
.link {
  color: #3b82f6;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
