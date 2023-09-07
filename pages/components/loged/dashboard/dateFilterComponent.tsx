import React, { useState, useEffect } from 'react';
import { FiltersDashboard } from '../../../../interfaces/dashboard.interface';

const DateFilter: React.FC<{
	onFilterChange: (
		startDate: string,
		endDate: string,
		yearStart: string,
		monthStart: string,
		yearEnd: string,
		monthEnd: string
	) => void,
	filters: FiltersDashboard;
}> = ({ onFilterChange, filters }) => {
	const [selectedYearStart, setSelectedYearStart] = useState('');
	const [selectedMonthStart, setSelectedMonthStart] = useState('');
	const [selectedYearEnd, setSelectedYearEnd] = useState('');
	const [selectedMonthEnd, setSelectedMonthEnd] = useState('');

	const months = [
		{ number: '01', text: 'Janeiro' },
		{ number: '02', text: 'Fevereiro' },
		{ number: '03', text: 'Março' },
		{ number: '04', text: 'Abril' },
		{ number: '05', text: 'Maio' },
		{ number: '06', text: 'Junho' },
		{ number: '07', text: 'Julho' },
		{ number: '08', text: 'Agosto' },
		{ number: '09', text: 'Setembro' },
		{ number: '10', text: 'Outubro' },
		{ number: '11', text: 'Novembro' },
		{ number: '12', text: 'Dezembro' }
	];

	const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

	const handleMonthStart = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedMonth = e.target.value;
		setSelectedMonthStart(selectedMonth);
	};

	const handleYearStart = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selecteYear = e.target.value;
		setSelectedYearStart(selecteYear);
	};

	const handleMonthEnd = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedMonth = e.target.value;
		setSelectedMonthEnd(selectedMonth);
	};

	const handleYearEnd = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selecteYear = e.target.value;
		setSelectedYearEnd(selecteYear);
	};

	const handleFilterClick = () => {
		const startDate = `${selectedYearStart}-${selectedMonthStart}-01`;
		const lastDay = lastDayOfMonth(parseInt(selectedYearEnd, 10), parseInt(selectedMonthEnd, 10));
		const endDate = `${selectedYearEnd}-${selectedMonthEnd}-${lastDay}`;

		onFilterChange(startDate, endDate, selectedYearStart, selectedMonthStart, selectedYearEnd, selectedMonthEnd);
	};

	const lastDayOfMonth = (year: number, month: number) => {
		const nextMonth = new Date(year, month + 1, 0);
		const lastDay = nextMonth.getDate();
		return lastDay;
	};

	useEffect(() => {

		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		if (filters.selectedYearStart != '') {
			setSelectedYearStart(filters.selectedYearStart);
		} else {
			setSelectedYearStart(currentYear.toString());
		}

		if (filters.selectedMonthStart != '') {
			setSelectedMonthStart(filters.selectedMonthStart);
		} else {
			setSelectedMonthStart(currentMonth.toString());
		}

		if (filters.selectedYearEnd != '') {
			setSelectedYearEnd(filters.selectedYearEnd);
		} else {
			setSelectedYearEnd(currentYear.toString());
		}

		if (filters.selectedMonthEnd != '') {
			setSelectedMonthEnd(filters.selectedMonthEnd);
		} else {
			setSelectedMonthEnd(currentMonth.toString());
		}

	}, []);

	return (
		<div className="flex justify-between mt-6">
			<div className="relative inline-block ml-2">
				<label className="ml-2 mr-2 text-lg font-medium text-gray-600 dark:text-white">Início:</label>
				<select
					value={selectedMonthStart}
					onChange={handleMonthStart}
					onBlur={handleMonthStart}
					className="mr-2 border rounded-lg px-2 py-1 dark:text-white"
				>
					<option value="">Mês</option>
					{months.map((month, index) => (
						<option key={index} value={month.number}>{month.text}</option>
					))}
				</select>
				<select
					value={selectedYearStart}
					onChange={handleYearStart}
					onBlur={handleYearStart}
					className="mr-2 border rounded-lg px-2 py-1 dark:text-white"
				>
					<option value="">Ano</option>
					{years.map((year, index) => (
						<option key={index} value={year}>{year}</option>
					))}
				</select>


				<label className="ml-2 mr-2 text-lg font-medium text-gray-600 dark:text-white">Fim:</label>
				<select
					value={selectedMonthEnd}
					onChange={handleMonthEnd}
					onBlur={handleMonthEnd}
					className="mr-2 border rounded-lg px-2 py-1 dark:text-white"
				>
					<option value="">Mês</option>
					{months.map((month, index) => (
						<option key={index} value={month.number}>{month.text}</option>
					))}
				</select>
				<select
					value={selectedYearEnd}
					onChange={handleYearEnd}
					onBlur={handleYearEnd}
					className="mr-2 border rounded-lg px-2 py-1 dark:text-white"
				>
					<option value="">Ano</option>
					{years.map((year, index) => (
						<option key={index} value={year}>{year}</option>
					))}
				</select>
			</div>
			<button
				className="mr-5 bg-default-green text-white rounded-md hover:bg-default-green-2 px-4 py-2"
				onClick={handleFilterClick}
			>
				Filtrar
			</button>
		</div >
	);
};

export default DateFilter;
