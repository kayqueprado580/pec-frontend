import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createCategory, editCategory, getCategory, validToken } from '../../../api/categories';
import Loading from '../../../components/loadingComponent';
import { useAuth } from '../../../contexts/authContext';
import { isValidString } from '../../../services/inputs.validator';


interface FormProps {
	isEditing: boolean;
	selectedId?: number | null;
	onCloseModal: () => void;
	isModalOpen: boolean;
	onMessage: (haveError: boolean | null, message: string | null) => void;
	sessionValid: () => void;
}

const CategoryForm: React.FC<FormProps> = ({
	isEditing,
	selectedId,
	onCloseModal,
	isModalOpen,
	onMessage,
	sessionValid
}) => {
	const router = useRouter();
	const { token } = useAuth();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const modalTitle = isEditing ? 'Editar' : 'Novo';
	const buttonTitle = isEditing ? 'Editar' : 'Criar';
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [nameError, setNameError] = useState('');

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
			const fetchCategory = async () => {
				setIsLoading(true);
				const isValid = await validToken(token);

				if (isValid) {
					try {
						const data = await getCategory(selectedId, token);
						const { name, description } = data;
						setName(name);
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

			fetchCategory();
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
			if (isValidString(name)) {
				setNameError('');
			}
			if (!isValidString(name)) {
				setNameError('Campo Obrigatório.');
				setIsSubmitting(false);
				return;
			}

			try {
				if (isEditing && selectedId) {
					await editCategory(selectedId, token, name, description);
				} else {
					await createCategory(token, name, description);
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

	return (
		isModalOpen && (
			<>
				{isLoading ? (
					<Loading />
				) : (
					<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md max-w-md modal">
							<button className="text-gray-500 hover:text-gray-600" onKeyDown={handleKeyDown} onClick={handleCloseModal}>
								X
							</button>
							<>
								<h2 className="text-2xl font-bold mb-4 text-center">{modalTitle}</h2>
								<form onSubmit={handleSubmit}>
									<div className="mb-4">
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
									<div className="mb-4">
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

export default CategoryForm;