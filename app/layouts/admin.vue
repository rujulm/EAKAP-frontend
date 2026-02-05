<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Profile',
      icon: 'tabler:user-circle',
    },
    {
      label: 'Dashboard',
      icon: 'tabler:browser',
    },
    {
      label: 'Manage Documents',
      icon: 'tabler:folder-open-filled',
    },
    {
      label: 'Manage Users',
      icon: 'tabler:users-group',
    }
  ],
 
])
</script>

<template>
  <div>
    <UDashboardGroup>
      <UDashboardSidebar class="bg-amber-50">
        <template #header>
          <div class="text-black text-2xl align-middle">
            Admin Dashboard
          </div>
        </template>
	<template #default>
					<UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48"/>        
	</template>

	<template #footer>
	<UButton class="w:auto"> Log Out </UButton>
	</template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <slot />
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>

