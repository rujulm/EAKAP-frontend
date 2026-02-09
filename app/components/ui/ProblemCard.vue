<template>
  <div class="problem-card border border-red-900/30 rounded-2xl p-6 hover:border-red-800/50 transition-all duration-300">
    <div class="flex items-start gap-4">
      <div class="w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
        <XIcon class="w-6 h-6 text-red-500" />
      </div>
      
      <div class="flex-1">
        <h4 class="text-xl font-semibold text-white mb-2">
          {{ title }}
        </h4>
        <p class="text-gray-400 leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import XIcon from '~/components/icons/XIcon.vue'
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>