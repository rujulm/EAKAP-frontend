<template>
  <div class="landing-page">
    <Comparison />
    <SecurityTrust />
  </div>
</template>


<script setup>
import Comparison from '~/components/sections/Comparison.vue';
import SecurityTrust from '~/components/sections/SecurityTrust.vue';
</script>

<style>
.landing-page {
  width: 100%;
  min-height: 100vh;
  background: #0f172a;
}
</style>
