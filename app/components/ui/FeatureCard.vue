<template>
  <div class="flex items-start gap-3 group">
    <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/30 transition-colors">
      <CheckIcon class="w-4 h-4 text-emerald-400" />
    </div>
    <div class="flex-1">
      <h5 class="text-white font-semibold mb-1">
        {{ title }}
      </h5>
      <p class="text-gray-400 text-sm leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import CheckIcon from '~/components/icons/CheckIcon.vue'
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