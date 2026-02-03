export interface DashboardStat {

	label: string
	value: number
	trend?: string

}
export interface DocumentActivity {
	id: string
	type: 'view' | 'edit' | 'upload' | 'share' | 'delete'
	timestamp: Date | string
	adminId: string
}

export interface Document {
	id: string
	name: string
	uploadDate: Date | string
	activity: DocumentActivity[]

}
