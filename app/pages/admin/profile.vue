<template>
  <NuxtLayout>
    <header>
      <h2>AI Assistant</h2>
      <div class="nav">
        <NuxtLink to="/admin/documents" class="nav-btn">Documents</NuxtLink>
        <button @click="handleLogout">Logout</button>
      </div>
    </header>
    <main class="wrap">
      <h1>Profile</h1>
      <section class="card" v-if="user">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Tenant ID:</strong> {{ user.tenant_id }}</p>
      </section>
    </main>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const { user, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 1rem auto;
  padding: 0 12px;
  font-family: Arial, Helvetica, sans-serif;
  color: #111;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 30px;
  background-color: rgb(81, 123, 170);
  color: white;
  padding: 10px;
}
.card {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
  background: #fff;
}
.nav-btn {
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: bold;
  margin: 2px;
  color: white;
  text-decoration: none;
}
</style>
