import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import CategoriesList from '../components/loged/categories/categoriesListComponent';
import { Category } from '../../interfaces/category.interface';
import { getCategories, deleteCategory, validToken } from '../api/categories';
import Alert from '../components/messageAlertComponent';
import CategoryForm from '../components/loged/categories/categoriesFormComponent';
import { useAuth } from '../contexts/authContext';

const CategoriesPage: React.FC = () => {
	const router = useRouter();
	const { token } = useAuth();
	const [categories, setCategories] = useState<Category[]>([]);
	const [showCategoriesList, setShowCategoriesList] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);
	const [modalKey, setModalKey] = useState<number>(0);
	const [shouldReloadData, setShouldReloadData] = useState(false);

	const sessionExpired = () => {
		setHaveError(true)
		setMessage(`Sessão expirada, você será redirecionado`)
		setIsAuthenticated(false)
		setTimeout(() => {
			setMessage('')
		}, 1500);
		router.push('/')
		return;
	}

	const fetchCategories = async () => {
		setIsLoading(true);
		const isValid = await validToken(token);

		if (isValid) {
			try {
				const data = await getCategories(token)
				setCategories(data);
				setShowCategoriesList(true);
			} catch (error: any) {
				console.error(error);
				if (error.status == 401) {
					sessionExpired();
				} else {
					setHaveError(true);
					setMessage(`Error: ${error}`)
				}
				setTimeout(() => {
					setMessage('');
				}, 1500);
			} finally {
				setIsLoading(false);
			}
		}
		else {
			sessionExpired();
		}

	};

	useEffect(() => {

		fetchCategories()

		if (shouldReloadData) {
			fetchCategories()
			setShouldReloadData(false)
		}
	}, [router, shouldReloadData]);

	const handleEdit = (id: number) => {
		setSelectedCategoryId(id);
		setShowCategoriesList(false);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: number) => {

		setIsLoading(true);
		deleteCategory(id, token)
			.then(() => {
				setHaveError(false);
				setMessage(`sucesso ao excluir!`)
				setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
				setTimeout(() => {
					setMessage('');
				}, 1500);
			})
			.catch((error) => {
				console.error(error);
				if (error.status == 401) {
					sessionExpired();
				} else {
					setHaveError(true);
					setMessage(`Error: ${error}`)
				}
				setTimeout(() => {
					setMessage('');
				}, 1500);
			})
			.finally(() => {
				setIsLoading(false);
			})


	};

	const handleOpenModal = () => {
		setSelectedCategoryId(null)
		setShowCategoriesList(false);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalKey((prevKey) => prevKey + 1);
		fetchCategories();
	};

	const handleSessionExpired = () => {
		sessionExpired()
	};

	const handleMessageAlert = (haveError: boolean, message: string | null) => {
		setHaveError(haveError);
		setMessage(`${message}`)
		setTimeout(() => {
			setMessage('');
		}, 1500);
	};

	const handleReloadData = () => {
		setShouldReloadData(true);
	};

	return (
		<div>
			{isAuthenticated ? (
				<>
					{isLoading ? (
						<Loading />
					) : (
						<>
							<Navbar />
							<div className="flex justify-between">
								<button
									className="bg-default-green text-white rounded-md hover:bg-default-green-2 m-4"
									onClick={handleOpenModal}
								>
									<i className="m-4 fa fa-plus fa-xl focus:outline-none focus:ring"></i>
								</button>
							</div>
							{showCategoriesList ? (
								<CategoriesList categories={categories} onEditCategory={handleEdit} onDeleteCategory={handleDelete} />
							) : (
								<CategoryForm
									isModalOpen={isModalOpen}
									onCloseModal={handleCloseModal}
									key={modalKey}
									selectedId={selectedCategoryId}
									isEditing={!!selectedCategoryId}
									onMessage={handleMessageAlert}
									sessionValid={handleSessionExpired}
								/>
							)}
						</>
					)}
				</>
			) : (<></>)}
			<Alert isOpen={!!message} onClose={() => setMessage('')} message={message} isMessageError={haveError} />
		</div>
	);
};


export default CategoriesPage;
