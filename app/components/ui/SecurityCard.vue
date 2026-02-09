<template>
  <div class="security-feature-card bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-300">

    <div class="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6">
      <component :is="icon" class="w-6 h-6 text-white" />
    </div>

    <h3 class="text-xl font-semibold text-white mb-3">
      {{ title }}
    </h3>
    
    <p class="text-gray-400 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script setup>

defineProps({
  icon: {
    type: String,
    required: true
  },
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