<template>
  <div class="compliance-badge bg-slate-800/40 border border-slate-700/50 rounded-lg px-6 py-3 hover:border-slate-600 transition-colors">
    <span class="text-gray-300 font-medium text-sm">
      {{ name }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>