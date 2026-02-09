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
  <UHeader>
    <template #title>
      <NuxtLogo class="h-6 w-auto" />
    </template>

    
    <template #right>

    <UNavigationMenu :items="items" />
			<UButton> Get Started </UButton>

    </template>
  </UHeader>
</template>
