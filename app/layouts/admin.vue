<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { logout, user } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  await router.push('/login')
}

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Profile',
      icon: 'tabler:user-circle',
      to: '/admin/profile'
    },
    {
      label: 'Dashboard',
      icon: 'tabler:layout-dashboard',
      to: '/admin'
    },
    {
      label: 'Manage Documents',
      icon: 'tabler:folder-open-filled',
      to: '/admin/documents'
    },
    {
      label: 'Manage Users',
      icon: 'tabler:users-group',
    }
  ],
 
])
</script>

<template>
  <div class="admin-shell">
    <UDashboardGroup>
      <UDashboardSidebar class="admin-sidebar">
        <template #header>
          <div class="sidebar-header">
            <NuxtImg src="/EAKAP Logo.png" alt="EAKAP" class="sidebar-logo" />
            <span class="sidebar-title">EAKAP</span>
          </div>
        </template>

	      <template #default>
					<UNavigationMenu orientation="vertical" :items="items" class="admin-nav data-[orientation=vertical]:w-full"/>        
	      </template>

	<template #footer>
        <button class="logout-btn" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="logout-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Log Out
        </button>
	</template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <slot />
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}

.admin-sidebar {
  background: rgba(15, 23, 42, 0.95);
  border-right: 1px solid rgba(71, 85, 105, 0.4);
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
}

.sidebar-logo {
  height: 2rem;
  width: auto;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.01em;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(71, 85, 105, 0.3);
}
  
.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
}

.logout-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>

<style>
.admin-nav [data-slot="link"] {
  padding: 0.87rem 0.2rem !important;
  color: #94a3b8 !important;
  border-radius: 0.5rem;
  transition: all 0.15s;
}

.admin-nav [data-slot="link"]:hover {
  color: white !important;
  background: rgba(71, 85, 105, 0.3) !important;
}

.admin-nav [data-slot="list"] {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-nav [data-slot="linkLeadingIcon"] {
  width: 2rem !important;
  height: 1.25rem !important;
}

.admin-nav [data-slot="linkLabel"] {
  font-size: 0.95rem !important;
}

.admin-nav a.router-link-active,
.admin-nav a.router-link-exact-active {
  color: white !important;
  background: rgba(59, 130, 246, 0.15) !important;
  border-left: 2px solid #3b82f6;
}

</style>