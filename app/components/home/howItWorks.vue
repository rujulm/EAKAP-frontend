
<script setup lang="ts">
const cards = ref([
  {
    title: 'Employee Asks a Question',
    description: 'A user submits a natural language query about internal company information through the EAKAP interface.',
    icon: 'i-lucide-message-circle',
    number: '01'
  },
  {
    title: 'Access Control Enforced',
    description: 'Before any AI processing, EAKAP validates the user\'s identity and retrieves their document-level permissions and clearances.',
    icon: 'i-lucide-shield-check',
    number: '02'
  },
  {
    title: 'Authorized Documents Queried',
    description: 'Only documents the user is explicitly permitted to access are retrieved and passed to the AI system for processing.',
    icon: 'i-lucide-file-search',
    number: '03'
  },
  {
    title: 'Compliant Answer Generated',
    description: 'The AI generates a response based solely on authorized documents. The entire interaction is logged for audit purposes.',
    icon: 'i-lucide-check-circle',
    number: '04'
  }
])
</script>


<template>
  <div class="bg-black">
    <UPageHero
      title="How EAKAP Works"
      description="A security-first architecture that constrains AI with access control, not blind trust. Every query respects your organization's permission structure."
      class="bg-black text-white"
      :ui="{ 
        headline: 'text-white border border-white/20 rounded-lg px-4 py-2 inline-flex items-center gap-2 bg-white/5',
        title: 'text-white',
        description: 'text-gray-300',
      }"
    >
      <template #headline>
        <UIcon name="i-lucide-shield-check" class="w-4 h-4 " />
        <span>Security by Design</span>
      </template>
    </UPageHero>
   
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-4 gap-6">
        <UCard
          v-for="(card, index) in cards"
          :key="index"
          class="bg-gray-900/50 border border-gray-800"
        >
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-800 rounded-lg p-3">
                <UIcon :name="card.icon" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="text-5xl font-bold text-gray-700 mb-4">{{ card.number }}</div>
            <h3 class="text-lg font-semibold text-white mb-3">{{ card.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ card.description }}</p>
          </div>
        </UCard>
      </div>
      
      <div class="mt-8 pb-8">
        <UCard class="bg-gray-900/50 border border-gray-800">
          <div class="text-center p-4">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-800 rounded-lg p-3">
                <UIcon name="i-lucide-shield" class="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">The AI Never Sees Unauthorized Documents</h3>
            <p class="text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Unlike systems that rely on the AI to respect access control, EAKAP enforces permissions before the AI processes any data. This architectural choice ensures that even sophisticated prompt injection attacks cannot bypass your security boundaries.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

