<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'


const items = computed<NavigationMenuItem[]>(() => [
  //NOTE: THe exact routes are to be added after the whole components are finalised
  {
    label: 'Security',
  },
  {
    label: 'How It Works',
  },
  {
    label: 'Enterprise',
  },
  {
    label: 'Contact',
  }])
</script>

<template>
  <UHeader class="bg-black border-b border-gray-800">
    <template #title>
      <div class="flex items-center">
        <NuxtImg src="/EAKAP Logo.png" alt="EAKAP Logo" class="h-12 w-auto" />
        <span class="text-white">EAKAP</span>
      </div>
    </template>

    
    <template #right>

    <UNavigationMenu :items="items" class="text-gray-300 hover:text-white transition-colors text-sm font-medium" />
			<UButton class="bg-white text-black hover:bg-gray-200"> Get Started </UButton>

    </template>
  </UHeader>
</template>
