<template>

  <UContainer>
  <UDashboardGroup>
    <UDashboardSidebar class="bg-amber-50">
	
				<template #header>
					<div class="text-black text-3xl align-middle">
					Admin Dashboard
					</div>
				</template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
  </UContainer>
</template>

