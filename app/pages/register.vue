<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Register</h1>
      <p class="auth-subtitle">Create an account</p>
      <form @submit.prevent="submit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password (min 8 characters)</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            placeholder="••••••••"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="tenant_id">Tenant ID</label>
          <input
            id="tenant_id"
            v-model="form.tenant_id"
            type="text"
            required
            placeholder="Tenant ID"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="dept">Department</label>
          <input
            id="dept"
            v-model="form.dept"
            type="text"
            required
            placeholder="Department"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="project">Project</label>
          <input
            id="project"
            v-model="form.project"
            type="text"
            required
            placeholder="Project"
            class="input"
          />
        </div>
        <div class="form-group">
          <label for="clearance">Clearance</label>
          <input
            id="clearance"
            v-model.number="form.clearance"
            type="number"
            required
            min="0"
            placeholder="0"
            class="input"
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>
      <p class="auth-footer">
        Already have an account?
        <NuxtLink to="/login" class="link">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const router = useRouter()
const { register } = useAuth()

const form = ref({
  email: '',
  password: '',
  tenant_id: '',
  dept: '',
  project: '',
  clearance: 0
})
const loading = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await register({
      email: form.value.email,
      password: form.value.password,
      tenant_id: form.value.tenant_id,
      dept: form.value.dept,
      project: form.value.project,
      clearance: Number(form.value.clearance)
    })
    success.value = 'Account created. You can sign in now.'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: unknown) {
    const err = e as { data?: { detail?: string | Array<{ msg?: string }> } }
    if (err.data?.detail) {
      error.value = Array.isArray(err.data.detail)
        ? err.data.detail.map((d) => d.msg ?? '').join(', ')
        : String(err.data.detail)
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
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
  max-height: 90vh;
  overflow-y: auto;
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
.success-msg {
  color: #10b981;
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
