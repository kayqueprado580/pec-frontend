import React, { useState } from 'react';
import Pagination from '../../paginationComponent'; // Importe o componente de paginação
import { Register } from '../../../../interfaces/register.interface';
import { format, endOfMonth, startOfMonth } from 'date-fns'

interface RegistersListProps {
	registers: Register[];
	onEditRegister: (id: number) => void
	onDeleteRegister: (id: number) => void;
	onFilterByDate: (startDate: string, endDate: string) => void;
}

const RegistersList: React.FC<RegistersListProps> = ({ registers, onEditRegister, onDeleteRegister, onFilterByDate }) => {

	if (!registers) {
		return (
			<div className="border-collapse">
				<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
			</div>
		)
	}

	const [take, setTake] = useState(10); // Número de itens por página
	const [skip, setSkip] = useState(0); // Número de itens para pular
	const [nameFilter, setNameFilter] = useState(''); // Estado para o filtro de nome
	const [startDate, setStartDate] = useState('');
	const [startDateInput, setStartDateInput] = useState('');
	const [endDate, setEndDate] = useState('');

	const filteredRegisters = registers.filter((register) =>
		register.name.toLowerCase().includes(nameFilter.toLowerCase())
	);

	const handlePageChange = (page: number) => {
		const newSkip = (page - 1) * take;
		setSkip(newSkip);
	};

	const handleFilterByDate = () => {
		// if (startDate && endDate) {
		// Converter as datas para objetos Date
		// const startDateObj = new Date(startDate);
		// const endDateObj = new Date(endDate);

		// Verificar se as datas são válidas
		// if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
		// onFilterByDate(startDateObj, endDateObj);
		// } else {
		// Tratar erro de datas inválidas
		// console.error('Datas de filtro inválidas');
		// }
		// }
		onFilterByDate(startDate, endDate);
	};

	return (
		<div className="border-collapse">
			<h2 className="text-2xl font-bold mb-2 text-center">Lista de Registros</h2>
			<div className="flex justify-between">
				<div>
					<label className="mr-2 ml-5 text-lg font-medium text-gray-600 dark:text-white">Nome: </label>
					<input
						type="text"
						placeholder="Filtrar por nome"
						value={nameFilter}
						onChange={(e) => setNameFilter(e.target.value)}
						className="border rounded-lg px-2 py-1 dark:text-white"
					/>
				</div>
				<div>
					<h2 className="mr-5 ml-2 text-lg font-medium text-gray-600 dark:text-white">Total: {filteredRegisters.length}</h2>
				</div>
			</div>

			<div className="flex justify-between">
				<div className="relative inline-block">
					<label className="mr-2 ml-5 text-lg font-medium text-gray-600 dark:text-white">Data Inicial: </label>
					<input
						type="month"
						value={startDateInput}
						onChange={(e) => {
							const selectedYearMonth = new Date(e.target.value);
							// const year = selectedYearMonth.getFullYear();
							const month = selectedYearMonth.getMonth() + 2;
							// if (month > 12) {

							// }
							// const formattedYear = month > 12 ? `${(selectedYearMonth.getFullYear() + 1)}` : `${selectedYearMonth.getFullYear()}`
							const formattedMonth = month < 10 ? `0${month}` : `${month}` || month > 12 ? `12`: `${month}`;
							// const formattedYear = month

							setStartDateInput(`${selectedYearMonth.getFullYear()}-${(formattedMonth)}`)
							const formattedDate = `${selectedYearMonth.getFullYear()}-${(formattedMonth + 1)}-01`;
							setStartDate(formattedDate);
						}}
						className="border rounded-lg px-2 py-1 dark:text-white"
					/>
				</div>
				<div>
					<label className="mr-2 ml-5 text-lg font-medium text-gray-600 dark:text-white">Data Final: </label>
					<input
						type="month"
						value={endDate}
						onChange={(e) => {
							const selectedYearMonth = new Date(e.target.value);
							const formattedDate = `${selectedYearMonth}-${format(endOfMonth(selectedYearMonth), 'dd')}`;

							// const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
							// 	.toString()
							// 	.padStart(2, '0')}-${format(endOfMonth(selectedDate), 'dd')}`;
							setEndDate(formattedDate);
						}}
						className="border rounded-lg px-2 py-1 dark:text-white"
					/>
				</div>
				<div>
					<button
						onClick={handleFilterByDate}
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
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Valor</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Data</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Pago</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Categoria</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Descrição</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-right font-semibold text-gray-600">Ações</th>
					</tr>
				</thead>
				<tbody>
					{filteredRegisters.slice(skip, skip + take).map((register) => (
						<tr key={register.id} className="bg-white hover:bg-gray-100 border-b">
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{register.name}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{register.value}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${register.date}`}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{register.pago}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{register.categoryId}</td>
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
			</table>

			<Pagination
				currentPage={Math.ceil((skip + 1) / take)}
				totalPages={Math.ceil(filteredRegisters.length / take)}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default RegistersList;
