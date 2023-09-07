export interface FiltersDashboard {
	startDate: string
	endDate: string
	selectedYearStart: string
	selectedMonthStart: string
	selectedYearEnd: string
	selectedMonthEnd: string
}

export interface Dashboard {
	dashboard: Board;
	report: Report;
}

interface Board {
	total: Total;
}

interface Total {
	balance: number
	positiveBalance: boolean
	revenue: number
	expense: number
}

interface Report {
	revenue: Revenue []
	expense: Expense []
}

interface Revenue {
	categoryId: number
	categoryName: string,
	totalAmount: number
}

interface Expense {
	categoryId: number,
	categoryName: string,
	totalAmount: number
}