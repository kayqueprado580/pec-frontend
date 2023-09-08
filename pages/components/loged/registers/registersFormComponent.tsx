import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createRegister, editRegister, getRegister, validToken } from '../../../api/registers';
import Loading from '../../loadingComponent';
import { useAuth } from '../../../../contexts/authContext';
import { isValidString } from '../../../../services/inputs.validator';
import { formatValue } from '../../../../utils/inputMask';
import { Category } from '../../../../interfaces/category.interface';

interface FormProps {
	isEditing: boolean;
	selectedId?: number | null;
	onCloseModal: () => void;
	isModalOpen: boolean;
	onMessage: (haveError: boolean | null, message: string | null) => void;
	sessionValid: () => void;
	categories: Category[];
}

const RegisterForm: React.FC<FormProps> = ({
	isEditing,
	selectedId,
	onCloseModal,
	isModalOpen,
	onMessage,
	sessionValid,
	categories
}) => {
	const router = useRouter();
	const { token } = useAuth();
	const modalTitle = isEditing ? 'Editar' : 'Novo';
	const buttonTitle = isEditing ? 'Editar' : 'Criar';
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [nameError, setNameError] = useState('');
	const [typeError, setTypeError] = useState('');
	const [dateError, setDateError] = useState('');
	const [categoryError, setCategoryError] = useState('');
	const [valueError, setValueError] = useState('');

	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [value, setValue] = useState('');
	const [date, setDate] = useState('');
	const [categoryId, setCategoryId] = useState(0);
	const [description, setDescription] = useState('');

	useEffect(() => {

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onCloseModal();
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const modal = document.querySelector('.modal');
			if (modal && !modal.contains(event.target as Node)) {
				onCloseModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener('keydown', handleEscapeKey);
			document.addEventListener('mousedown', handleClickOutside);
		}

		if (isEditing && selectedId) {
			const fetchRegister = async () => {
				setIsLoading(true);
				const isValid = await validToken(token);

				if (isValid) {
					try {
						const data = await getRegister(selectedId, token);
						const { name, type, value, date, categoryId, description } = data;
						setName(name);
						setType(type);
						setValue(formatValue(value));
						const dateValue = new Date(date).toISOString().split('T')[0];
						setDate(dateValue);
						setCategoryId(categoryId);
						setDescription(description);
					} catch (error) {
						console.error(error);
					} finally {
						setIsLoading(false);
					}
				} else {
					setIsLoading(false);
					sessionValid()
				}
			};

			fetchRegister();
		}

		return () => {
			document.addEventListener('keydown', handleEscapeKey);
			document.addEventListener('mousedown', handleClickOutside);
		};

	}, [router, isEditing, selectedId]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		const isValid = await validToken(token);

		if (isValid) {

			if (!checkInputName() || !checkSelectedType() || !checkInputValue() || !checkInputDate() || !checkSelectedCategory()) {
				setIsSubmitting(false);
				return;
			}

			const auxValue = value.replace(/[^\d,]/g, '');
			const auxDate = `${date}T01:13:29.688Z`

			try {
				if (isEditing && selectedId) {
					await editRegister(selectedId, token, name, type, auxValue, auxDate, true, categoryId, description);
				} else {
					await createRegister(token, name, type, auxValue, auxDate, true, categoryId, description);
				}
				onMessage(false, 'ação realizada com sucesso');
			} catch (error) {
				console.error(error);
				onMessage(true, `Erro: ${error}`);
			} finally {
				setIsLoading(false);
				onCloseModal();
				setIsSubmitting(false);
			}
		} else {
			sessionValid()
		}
	};

	const handleCloseModal = () => {
		isModalOpen = false;
		onCloseModal();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode === 27 || event.key === 'Escape') {
			handleCloseModal();
		}
	};

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setType(e.target.value);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategoryId(parseInt(e.target.value, 10));
	};

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/[^\d]/g, '');
		const formattedValue = formatValue(rawValue);
		setValue(formattedValue);
	};

	const checkInputName = () => {
		if (isValidString(name)) {
			setNameError('');
			return true;
		}
		if (!isValidString(name)) {
			setNameError('Campo Obrigatório.');
			return false;
		}
	}
	const checkSelectedType = () => {
		if (isValidString(type)) {
			setTypeError('');
			return true;
		}
		if (!isValidString(type)) {
			setTypeError('Campo Obrigatório.');
			return false;
		}
	}
	const checkInputValue = () => {
		if (isValidString(value)) {
			setValueError('');
			return true;
		}
		if (!isValidString(value)) {
			setValueError('Campo Obrigatório.');
			return false;
		}
	}
	const checkInputDate = () => {
		if (isValidString(date)) {
			setDateError('');
			return true;
		}
		if (!isValidString(date)) {
			setDateError('Campo Obrigatório.');
			return false;
		}
	}

	const checkSelectedCategory = () => {
		if (categoryId != 0) {
			setCategoryError('');
			return true;
		}
		if (categoryId == 0) {
			setCategoryError('Campo Obrigatório.');
			return false;
		}
	}

	return (
		isModalOpen && (
			<>
				{isLoading ? (
					<Loading />
				) : (
					<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md max-w-3xl modal">
							<button className="text-gray-500 hover:text-gray-600" onKeyDown={handleKeyDown} onClick={handleCloseModal}>
								X
							</button>
							<>
								<h2 className="text-2xl font-bold mb-4 text-center">{modalTitle}</h2>
								<form onSubmit={handleSubmit}>
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div>
											<label htmlFor="name" className="block mb-2 font-medium text-gray-900">
												Nome:
											</label>
											<input
												type="text"
												id="name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="w-full border border-gray-300 rounded-md px-3 py-2"
											/>
											{nameError && <p className="text-red-500">{nameError}</p>}
										</div>
										<div>
											<label htmlFor="type" className="block mb-2 font-medium text-gray-900">
												Tipo:
											</label>
											<select
												value={type}
												onChange={handleTypeChange}
												onBlur={handleTypeChange}
												className="w-full border border-gray-300 rounded-md px-3 py-2"
											>
												<option value="">Tipo</option>
												<option value="revenue">Receita</option>
												<option value="expense">Despesa</option>
											</select>
											{typeError && <p className="text-red-500">{typeError}</p>}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div>
											<label htmlFor="value" className="block mb-2 font-medium text-gray-900">
												Valor:
											</label>
											<input
												type="text"
												id="value"
												value={value}
												onChange={handleValueChange}
												className="w-full border border-gray-300 rounded-md px-3 py-2"
											/>
											{valueError && <p className="text-red-500">{valueError}</p>}
										</div>
										<div>
											<label htmlFor="date" className="block mb-2 font-medium text-gray-900">
												Data:
											</label>
											<input
												type="date"
												id="date"
												value={date}
												onChange={(e) => setDate(e.target.value)}
												className="w-full border border-gray-300 rounded-md px-3 py-2"
											/>
											{dateError && <p className="text-red-500">{dateError}</p>}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div>
											<label htmlFor="categoryId" className="block mb-2 font-medium text-gray-900">
												Categoria:
											</label>
											<select
												value={categoryId}
												onChange={handleCategoryChange}
												onBlur={handleCategoryChange}
												className="border rounded-lg py-1 dark:text-white"
											>
												<option value={0}>Categorias</option>
												{categories.map((category, index) => (
													<option key={index} value={category.id}>{category.name}</option>
												))}
											</select>
											{categoryError && <p className="text-red-500">{categoryError}</p>}
										</div>
										<div>
											<label htmlFor="description" className="block mb-2 font-medium text-gray-900">
												Descrição:
											</label>
											<input
												type="text"
												id="description"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												className="w-full border border-gray-300 rounded-md px-3 py-2"
											/>
										</div>
									</div>
									<div className="text-center">
										<button
											type="submit"
											className="px-4 py-2 bg-default-green text-white rounded-md hover:bg-default-green-2"
											disabled={isSubmitting}
										>
											{buttonTitle}
										</button>
									</div>
								</form>
							</>
						</div>
					</div>
				)}
			</>
		)
	);
};

export default RegisterForm;