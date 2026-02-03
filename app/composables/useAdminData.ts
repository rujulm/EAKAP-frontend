import type { Document, DashboardStat } from '../../types/admin'
import { useState } from 'nuxt/app'
export const useAdminData = () => {

	const stats = useState<DashboardStat[]>('admin-stats', () => [

		{ label: 'Queries Today', value: 120 },
		{ label: 'Active Users', value: 23 },

		{ label: 'Documents', value: 12 },
		{ label: 'Positive Feedback', value: 87 },
	])

	const documents = useState<Document[]>('admin-docs', () => [

		{
			id: '1',
			name: 'Doc1.pdf',
			uploadDate: '19/01/2026',
			activity: [
				{
					id: 'act-1',
					type: 'upload',
					adminId: 'System',
					timestamp: '2026-01-19T10:00:00Z'
				}
			]
		},
		{
			id: '2',
			name: 'Doc2.pdf',
			uploadDate: '19/01/2026',
			activity: [
				{
					id: 'act-2',
					type: 'edit',
					adminId: 'Admin',
					timestamp: '2026-01-19T14:30:00Z'
				}
			]
		},
		{
			id: '3',
			name: 'Doc3.pdf',
			uploadDate: '18/01/2026',
			activity: []
		}


	])


	return {
		stats,
		documents
	}

}
