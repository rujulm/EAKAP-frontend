<script setup lang="ts">

export interface CardProps {
  stat: string
  value: string
}

defineProps<CardProps>()
</script>

<template>
  <UPageCard 
    class = "bg-amber-50 m-3
		"
    highlight
    highlight-color="warning"
  >
    <template #header>
      <div class="text-2xl align-middle text-black">
        {{ stat }}
      </div>
    </template>	
    <template #footer>
      <div class="text-3xl text-gray-700 align-middle">
        {{ value }}
      </div>
    </template>
  </UPageCard>
</template>
