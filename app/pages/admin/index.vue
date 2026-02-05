<script setup lang='ts' >
import { useAdminData } from '~/composables/useAdminData'
import DashboardStatCard from '~/components/dashboard/statCard.vue'

const { stats } = useAdminData()
definePageMeta({layout: 'admin'})
</script>

<template>
  <UContainer>
	<DashboardStatCard
		v-for="stat in stats"
			:key="stat.label"
			:stat="stat.label"
			:value=12
		/>
  </UContainer>
</template>


