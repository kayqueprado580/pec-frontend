import React, { useState } from 'react';
import Pagination from '../../paginationComponent'; // Importe o componente de paginação
import { Category } from '../../../../interfaces/category.interface';

interface CategoriesListProps {
	categories: Category[];
	onEditCategory: (id: number) => void
	onDeleteCategory: (id: number) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories, onEditCategory, onDeleteCategory }) => {

	if (!categories) {
		return (
			<div className="border-collapse">
				<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
			</div>
		)
	}

	const [take, setTake] = useState(10); // Número de itens por página
	const [skip, setSkip] = useState(0); // Número de itens para pular
	const [nameFilter, setNameFilter] = useState(''); // Estado para o filtro de nome

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(nameFilter.toLowerCase())
	);

	const handlePageChange = (page: number) => {
		const newSkip = (page - 1) * take;
		setSkip(newSkip);
	};

	return (
		<div className="border-collapse">
			<h2 className="text-2xl font-bold mb-2 text-center">Lista de Categorias</h2>
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
					<h2 className="mr-5 ml-2 text-lg font-medium text-gray-600 dark:text-white">Total: {filteredCategories.length}</h2>
				</div>
			</div>

			<table className="min-w-full">
				<thead>
					<tr>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Nome</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-left font-semibold text-gray-600">Descrição</th>
						<th className="px-6 py-3 border-b-2 border-gray-300 text-right font-semibold text-gray-600">Ações</th>
					</tr>
				</thead>
				<tbody>
					{filteredCategories.slice(skip, skip + take).map((category) => (
						<tr key={category.id} className="bg-white hover:bg-gray-100 border-b">
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{category.name}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.description}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
								<button
									onClick={() => onEditCategory(category.id)}
									className="text-blue-500 hover:underline mr-2"
								>
									<i className="fa fa-pencil fa-md hover:text-black focus:outline-none focus:ring"></i>
								</button>
								<button
									onClick={() => onDeleteCategory(category.id)}
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
				totalPages={Math.ceil(filteredCategories.length / take)}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default CategoriesList;
