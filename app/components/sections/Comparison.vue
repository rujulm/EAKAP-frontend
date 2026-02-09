<template>
  <section class="comparison py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Traditional AI tools create security gaps
        </h2>
        <p class="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
          When employees use general-purpose AI to query company data, access controls break
          down. Sensitive information leaks. Compliance fails.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        <div class="space-y-6">
          <ProblemCard
            v-for="problem in problems"
            :key="problem.title"
            :title="problem.title"
            :description="problem.description"
          />
        </div>

        <div class="solution-card bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300">
          
          <div class="flex items-start gap-4 mb-6">
            <div class="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldIcon class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-3xl font-bold text-white mt-2">
              EAKAP's Approach
            </h3>
          </div>

          <p class="text-gray-300 text-lg mb-8 leading-relaxed">
            Security-first AI that enforces access control before the AI ever
            processes a query. Users only receive answers derived from
            documents they're explicitly authorized to access.
          </p>

          <div class="space-y-5">
            <FeatureCard
              v-for="feature in features"
              :key="feature.title"
              :title="feature.title"
              :description="feature.description"
            />
          </div>
          
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup>

import ProblemCard from '~/components/ui/ProblemCard.vue'
import FeatureCard from '~/components/ui/FeatureCard.vue'
import ShieldIcon from '~/components/icons/ShieldIcon.vue'

const problems = [
  {
    title: 'Data Leakage',
    description: 'AI systems that ingest all company documents without access control can inadvertently expose sensitive information to unauthorized users.'
  },
  {
    title: 'Prompt Injection',
    description: 'Malicious users can craft prompts to bypass intended restrictions, accessing documents and information beyond their clearance level.'
  },
  {
    title: 'No Audit Trail',
    description: 'Without proper logging, compliance teams can\'t track who accessed what information, creating regulatory and security risks.'
  }
]

const features = [
  {
    title: 'Pre-Query Filtering',
    description: 'Documents are filtered by permissions before AI processing'
  },
  {
    title: 'Role-Based Access Control',
    description: 'RBAC enforced at query time, not trusted to the model'
  },
  {
    title: 'Complete Audit Logs',
    description: 'Every query and response is logged for compliance'
  },
  {
    title: 'Injection-Resistant',
    description: 'Security layer is independent of the language model'
  }
]
</script>

<style scoped>
.comparison {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  position: relative;
}

.comparison::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 40px 40px;
  pointer-events: none;
}
</style>