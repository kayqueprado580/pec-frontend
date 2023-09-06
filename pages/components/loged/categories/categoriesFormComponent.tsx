import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createCategory, editCategory, getCategory } from '../../../api/categories';
import Loading from '../../../components/loadingComponent';
import Alert from '../../../components/messageAlertComponent';


interface FormProps {
	isEditing: boolean;
	selectedId?: number | null;
	onCloseModal: () => void;
	isModalOpen: boolean;
	// alert: (message: string, haveError: boolean) => void;
	// reloadData: () => void;
}

const CategoryForm: React.FC<FormProps> = ({
	isEditing,
	selectedId,
	onCloseModal,
	isModalOpen,
	// alert,
	// reloadData
}) => {
	const router = useRouter();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const modalTitle = isEditing ? 'Editar' : 'Novo';
	const buttonTitle = isEditing ? 'Editar' : 'Criar';
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);

	const validToken = async () => {
		if (!sessionStorage.getItem('accessToken')) {
			console.log('redirect');
			router.push('/');
		} else {
			setIsAuthenticated(true);
		}
	};

	// const sessionExpired = () => {
	// 	setHaveError(true)
	// 	setMessage(`Sessão expirada, você será redirecionado`)
	// 	setIsAuthenticated(false)
	// 	setTimeout(() => {
	// 		setMessage('')
	// 	}, 1500);
	// 	console.log('redirect')
	// 	router.push('/')
	// 	return;
	// }

	useEffect(() => {

		if (isEditing && selectedId) {
			const fetchCategory = async () => {
				await validToken();

				if (isAuthenticated) {
					const token = sessionStorage.getItem('accessToken');
					setIsLoading(true);

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
				}
			};

			fetchCategory();
		}
	}, [router, isEditing, selectedId, isAuthenticated]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		await validToken();

		if (isAuthenticated) {
			const token = sessionStorage.getItem('accessToken');

			try {
				if (isEditing && selectedId) {
					await editCategory(selectedId, token, name, description);
				} else {
					await createCategory(token, name, description);
				}
				setHaveError(false)
				setMessage(`Sucesso`)
			} catch (error) {
				console.error(error);
				setHaveError(false)
				setMessage(`error: ${error}`)
			} finally {
				setIsLoading(false);
				onCloseModal();
			}
		}
	};

	if (!isModalOpen) {
		return null;
	}

	const handleCloseModal = () => {
		onCloseModal();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.keyCode === 27 || event.key === 'Escape') {
			handleCloseModal();
		}
	};

	return (
		isModalOpen && (
			<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md max-w-md modal" tabIndex={-1}>
					<button className="text-gray-500 hover:text-gray-600" onKeyDown={handleKeyDown} onClick={handleCloseModal}>
						X
					</button>
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
							>
								{buttonTitle}
							</button>
						</div>
					</form>
				</div>
				<Alert isOpen={!!message} onClose={() => setMessage('')} message={message} isMessageError={haveError} />
			</div>
		)
	);
};

export default CategoryForm;