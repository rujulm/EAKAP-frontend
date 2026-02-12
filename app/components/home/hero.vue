
<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Register Your Company',
    trailingIcon: 'i-lucide-arrow-right'
  },
  {
    label: 'Talk to Us',
    color: 'neutral',
    variant: 'subtle',
  }
])
</script>

<template>
  <UPageHero
    title="Enterprise AI that respects access boundaries"
    description="EAKAP enables employees to query internal documents using AI — while strictly enforcing document-level permissions and access control. Your team gets powerful answers. Your security team stays confident."
    :links="links"
	class="bg-black text-white min-h-screen"
    :ui="{ 
      headline: 'text-white border border-white/20 rounded-lg px-4 py-2 inline-flex items-center gap-2 bg-white/5',
      title: 'text-white',
      description: 'text-gray-300',
      links: '[&_button]:bg-white [&_button]:text-black [&_button]:hover:bg-gray-200'
    }"
  >
    <template #headline>
      <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
      <span>Enterprise-Grade Security</span>
    </template>
  </UPageHero>
</template>
