<template>
  <section class="security-trust py-20 px-6">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Security & Trust
        </h2>
        <p class="text-lg text-gray-400 max-w-3xl mx-auto">
          Built for CISOs, security teams, and compliance officers. EAKAP provides the
          guarantees enterprise organizations demand.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <SecurityCard 
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>


      <div class="mb-16">
        <p class="text-center text-sm text-gray-500 uppercase tracking-wider mb-6">
          Compliance & Certifications
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <ComplianceBadge
            v-for="badge in complianceBadges"
            :key="badge"
            :name="badge"
          />
        </div>
      </div>

      <div class="quote-card bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
            <ShieldIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Security is not a feature. It's the foundation.
        </h3>
        
        <p class="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
          EAKAP is designed from the ground up with security as the primary constraint.
          Access control is enforced architecturally, not as an afterthought.
        </p>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import SecurityCard from '~/components/ui/SecurityCard.vue'
import ComplianceBadge from '~/components/ui/ComplianceBadge.vue'
import ShieldIcon from '~/components/icons/ShieldIcon.vue'
import DocumentIcon from '~/components/icons/DocumentIcon.vue'
import EyeIcon from '~/components/icons/EyeIcon.vue'
import ServerIcon from '~/components/icons/ServerIcon.vue'
import LockIcon from '~/components/icons/LockIcon.vue'
import DatabaseIcon from '~/components/icons/DatabaseIcon.vue'

const features = [
  {
    icon: ShieldIcon,
    title: 'Role-Based Access Control',
    description: 'Document-level permissions are enforced at query time. Users can only access information they\'re explicitly authorized to view.'
  },
  {
    icon: DocumentIcon,
    title: 'Document-Level Permissions',
    description: 'Fine-grained control over every file, folder, and data source. Integrates with your existing permission infrastructure.'
  },
  {
    icon: EyeIcon,
    title: 'Complete Audit Logs',
    description: 'Every query, response, and document access is logged with full context. Meet compliance requirements with comprehensive audit trails.'
  },
  {
    icon: ServerIcon,
    title: 'Private Deployment Options',
    description: 'Deploy on-premises, in your VPC, or use our SOC 2 certified cloud. Your data never leaves your infrastructure if you choose.'
  },
  {
    icon: LockIcon,
    title: 'Zero Trust Architecture',
    description: 'Security is enforced at every layer. No component trusts any other without explicit verification and authorization.'
  },
  {
    icon: DatabaseIcon,
    title: 'No Training on Customer Data',
    description: 'Your documents are never used to train AI models. Data is processed in real-time for queries only, with no retention.'
  }
]

const complianceBadges = [
  'SOC 2 Type II',
  'GDPR Compliant',
  'HIPAA Ready',
  'ISO 27001',
  'CCPA Compliant'
]
</script>

<style scoped>
.security-trust {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}
</style>