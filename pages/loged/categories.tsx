import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import CategoriesList from '../components/loged/categories/categoriesListComponent';
import { Category } from '../../interfaces/category.interface';
import { getCategories, deleteCategory } from '../api/categories';
import Alert from '../components/messageAlertComponent';
import CategoryForm from '../components/loged/categories/categoriesFormComponent';

//TO DO
// Categories Form Component (Edit/New)
// - Modal


const CategoriesPage: React.FC = () => {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [showCategoriesList, setShowCategoriesList] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);
	const [modalKey, setModalKey] = useState<number>(0);
	const [shouldReloadData, setShouldReloadData] = useState(false);

	const validToken = async () => {
		if (!sessionStorage.getItem('accessToken')) {
			console.log('redirect');
			router.push('/');
			return;
		} else {
			setIsAuthenticated(true);
		}
	}

	const sessionExpired = () => {
		setHaveError(true)
		setMessage(`Sessão expirada, você será redirecionado`)
		setIsAuthenticated(false)
		setTimeout(() => {
			setMessage('')
		}, 1500);
		console.log('redirect')
		router.push('/')
		return;
	}

	const fetchCategories = async () => {
		await validToken();

		if (isAuthenticated) {
			const token = sessionStorage.getItem('accessToken');
			setIsLoading(true);

			try {
				const data = await getCategories(token)
				console.log(`categories: ${data}`)
				setCategories(data);
			} catch (error) {
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

	};

	useEffect(() => {

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

		await validToken();

		if (isAuthenticated) {
			const token = sessionStorage.getItem('accessToken');
			setIsLoading(true);
			deleteCategory(id, token)
				.then(() => {
					setHaveError(false);
					setMessage(`sucesso ao excluir!`)
					setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
					setTimeout(() => {
						setMessage('');
					}, 900);
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
		}

	};

	// const handleOpenModal = () => {
	// 	setShowCategoriesList(false);
	// 	setIsModalOpen(true);
	// };

	// const handleCloseModal = () => {
	// 	setShowCategoriesList(true);
	// 	setIsModalOpen(false);
	// 	setCategories((prevCategories) => prevCategories);
	// };

	// const handleMessageForm = (message: string, haveError: boolean) => {
	// 	setHaveError(haveError);
	// 	setMessage(`Error: ${message}`)
	// };

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
								// onClick={handleOpenModal}
								>
									<i className="m-4 fa fa-plus fa-xl focus:outline-none focus:ring"></i>
								</button>
							</div>
							{showCategoriesList ? (
								<CategoriesList categories={categories} onEditCategory={handleEdit} onDeleteCategory={handleDelete} />
							) : (
								<>
								</>
								// <CategoryForm
								// 	isModalOpen={isModalOpen}
								// 	onCloseModal={() => handleCloseModal()}
								// 	key={modalKey}
								// 	selectedId={selectedCategoryId}
								// 	isEditing={!!selectedCategoryId}
								// // alert={handleMessageForm}
								// // reloadData={handleReloadData}
								// />
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
