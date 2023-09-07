export interface Register {
	id: number;
	name: string;
	type: string;
	value: string;
	date: Date;
	pago: boolean;
	categoryId: number;
	description: string;
	userId: number;
}

export interface FiltersRegisters {
	startDate: string
	endDate: string
	selectedYearStart: string
	selectedMonthStart: string
	selectedYearEnd: string
	selectedMonthEnd: string
	nameFilter: string
	typeFilter: string
	categoryFilter: number
}