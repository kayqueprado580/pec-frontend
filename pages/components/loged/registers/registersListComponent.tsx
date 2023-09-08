import React, { useEffect, useState } from 'react';
import Pagination from '../../paginationComponent'; // Importe o componente de paginação
import { FiltersRegisters, Register } from '../../../../interfaces/register.interface';
import { Category } from '../../../../interfaces/category.interface';

interface RegistersListProps {
	registers: Register[];
	categories: Category[];
	onEditRegister: (id: number) => void;
	onDeleteRegister: (id: number) => void;
	onFilter: (
		yearStart: string,
		monthStart: string,
		yearEnd: string,
		monthEnd: string,
		name: string,
		type: string,
		categoryId: number) => void;
	filters: FiltersRegisters;
}

const RegistersList: React.FC<RegistersListProps> = ({ registers, categories, onEditRegister, onDeleteRegister, onFilter, filters }) => {

	const [take, setTake] = useState(10);
	const [skip, setSkip] = useState(0);
	const [selectedYearStart, setSelectedYearStart] = useState('');
	const [selectedMonthStart, setSelectedMonthStart] = useState('');
	const [selectedYearEnd, setSelectedYearEnd] = useState('');
	const [selectedMonthEnd, setSelectedMonthEnd] = useState('');
	const [nameFilter, setNameFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [categoryFilter, setCategoryFilter] = useState(0);

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

		setNameFilter(filters.nameFilter);
		setTypeFilter(filters.typeFilter);
		setCategoryFilter(filters.categoryFilter);
	}, [registers]);

	if (!categories) {
		return (
			<div className="border-collapse">
				<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Por favor, criar categorias para utilizar em seus registros..</h2>
			</div>
		)
	}

	if (!registers) {
		return (
			<div className="border-collapse">
				<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
			</div>
		)
	}

	const handlePageChange = (page: number) => {
		const newSkip = (page - 1) * take;
		setSkip(newSkip);
	};

	const handleFilter = () => {
		onFilter(selectedYearStart, selectedMonthStart, selectedYearEnd, selectedMonthEnd, nameFilter, typeFilter, categoryFilter);
	};

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

	const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(e.target.value);
	};

	const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTypeFilter(e.target.value);
	};

	const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategoryFilter(parseInt(e.target.value, 10));
	};

	return (
		<div className="border-collapse">
			<h2 className="text-2xl font-bold mb-2 text-center">Lista de Registros</h2>
			<div className="flex justify-end content-end">
				<h2 className="mr-5 ml-2 text-lg font-medium text-gray-600 dark:text-white">Total: {registers.length}</h2>
			</div>

			<div className="flex justify-between mt-2">
				<div className="relative inline-block">
					<label className="ml-2 text-lg font-medium text-gray-600 dark:text-white">Inicio: </label>
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
					<label className="ml-2 text-lg font-medium text-gray-600 dark:text-white">Fim: </label>
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
					<label className="ml-2 text-lg font-medium text-gray-600 dark:text-white">Nome: </label>
					<input
						type="text"
						placeholder="Filtrar por nome"
						value={nameFilter}
						onChange={handleNameFilterChange}
						className="mr-2 border rounded-lg px-2 py-1 dark:text-white"
					/>
					<select
						value={typeFilter}
						onChange={handleTypeFilterChange}
						onBlur={handleTypeFilterChange}
						className="mr-2 ml-2 border rounded-lg px-2 py-1 dark:text-white"
					>
						<option value="">Tipo</option>
						<option value="revenue">Receita</option>
						<option value="expense">Despesa</option>
					</select>
					<select
						value={categoryFilter}
						onChange={handleCategoryFilterChange}
						onBlur={handleCategoryFilterChange}
						className="border rounded-lg py-1 dark:text-white"
					>
						<option value={0}>Categorias</option>
						{categories.map((category, index) => (
							<option key={index} value={category.id}>{category.name}</option>
						))}
					</select>
				</div>

				<div>
					<button
						onClick={handleFilter}
						className="px-4 py-2 bg-default-green text-white rounded-md hover:bg-default-green-2"
					>
						Filtrar
					</button>
				</div>
			</div>

			<table className="min-w-full">
				<thead>
					<tr>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Nome</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Tipo</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Valor</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Data</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Categoria</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Descrição</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-right font-semibold text-gray-600">Ações</th>
					</tr>
				</thead>
				{!registers || registers.length < 1 ? (
					<>
						<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
					</>
				) :
					(<>
						<tbody>
							{registers.slice(skip, skip + take).map((register) => (
								<tr key={register.id} className="bg-white hover:bg-gray-100 border-b">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{register.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{register.type === 'revenue' ? 'Receita' : 'Despesa'}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {register.value}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(register.date).toLocaleDateString('pt-BR')}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{categories.find(category => category.id === register.categoryId)?.name}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{register.description}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
										<button
											onClick={() => onEditRegister(register.id)}
											className="text-blue-500 hover:underline mr-2"
										>
											<i className="fa fa-pencil fa-md hover:text-black focus:outline-none focus:ring"></i>
										</button>
										<button
											onClick={() => onDeleteRegister(register.id)}
											className="text-red-500 hover:underline"
										>
											<i className="fa fa-trash fa-md hover:text-black focus:outline-none focus:ring"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</>)}
			</table>

			<Pagination
				currentPage={Math.ceil((skip + 1) / take)}
				totalPages={Math.ceil(registers.length / take)}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default RegistersList;
