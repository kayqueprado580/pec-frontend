import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import { Register } from '../../interfaces/register.interface';
import { getRegisters, deleteRegister, validToken } from '../api/registers';
import Alert from '../components/messageAlertComponent';
import { useAuth } from '../contexts/authContext';
import RegistersList from '../components/loged/registers/registersListComponent';
import { getCategories } from '../api/categories';
import { Category } from '../../interfaces/category.interface';
import RegisterForm from '../components/loged/registers/registersFormComponent';

const RegistersPage: React.FC = () => {
	const router = useRouter();
	const { token } = useAuth();
	const [registers, setRegisters] = useState<Register[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [showRegistersList, setShowRegistersList] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [selectedRegisterId, setSelectedRegisterId] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);
	const [modalKey, setModalKey] = useState<number>(0);
	const [filterValues, setFilterValues] = useState({
		startDate: '',
		endDate: '',
		selectedYearStart: '',
		selectedMonthStart: '',
		selectedYearEnd: '',
		selectedMonthEnd: '',
		nameFilter: '',
		typeFilter: '',
		categoryFilter: 0,
	});

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

	const fetchRegisters = async (
		startDate?: string | null,
		endDate?: string | null,
		name?: string | null,
		type?: string | null,
		categoryId?: number | null,
	) => {
		setIsLoading(true);
		const isValid = await validToken(token);

		if (isValid) {
			requestRegisters(startDate, endDate, name, type, categoryId)
		}
		else {
			sessionExpired();
		}

	};

	const fetchCategories = async () => {
		setIsLoading(true);
		try {
			const data = await getCategories(token)
			setCategories(data);
		} catch (error) {
			handleErrorSetting(error)
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRegisters(filterValues.startDate, filterValues.endDate, filterValues.nameFilter, filterValues.typeFilter, filterValues.categoryFilter);
		fetchCategories()
	}, [router]);


	const requestRegisters = async (
		startDate?: string | null,
		endDate?: string | null,
		name?: string | null,
		type?: string | null,
		categoryId?: number | null,
	) => {
		try {
			const data = await getRegisters(token, startDate, endDate, name, type, categoryId);
			setRegisters(data);
			setShowRegistersList(true);
		} catch (error) {
			handleErrorSetting(error)
		} finally {
			setIsLoading(false);
		}
	}
	const handleFilter = (
		yearStart: string,
		monthStart: string,
		yearEnd: string,
		monthEnd: string,
		name: string,
		type: string,
		categoryId: number,
	) => {
		setIsLoading(true);
		const startDate = `${yearStart}-${monthStart}-01`;
		const lastDay = lastDayOfMonth(parseInt(yearEnd, 10), parseInt(monthEnd, 10));
		const endDate = `${yearEnd}-${monthEnd}-${lastDay}`;
		requestRegisters(startDate, endDate, name, type, categoryId);
		setFilterValues({
			startDate: startDate,
			endDate: endDate,
			selectedYearStart: yearStart,
			selectedMonthStart: monthStart,
			selectedYearEnd: yearEnd,
			selectedMonthEnd: monthEnd,
			nameFilter: name,
			typeFilter: type,
			categoryFilter: categoryId,
		})
	};

	const lastDayOfMonth = (year: number, month: number) => {
		const nextMonth = new Date(year, month + 1, 0);
		const lastDay = nextMonth.getDate();
		return lastDay;
	};

	const handleEdit = (id: number) => {
		setSelectedRegisterId(id);
		setShowRegistersList(false);
		setIsModalOpen(true);
	};

	const handleDelete = async (id: number) => {
		setIsLoading(true);
		deleteRegister(id, token)
			.then(() => {
				setHaveError(false);
				setMessage(`sucesso ao excluir!`)
				setRegisters((prevRegisters) => prevRegisters.filter((register) => register.id !== id));
				setTimeout(() => {
					setMessage('');
				}, 1500);
			})
			.catch((error) => {
				handleErrorSetting(error)
			})
			.finally(() => {
				setIsLoading(false);
			})
	};

	const handleOpenModal = () => {
		setSelectedRegisterId(null)
		setShowRegistersList(false);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setModalKey((prevKey) => prevKey + 1);
		fetchRegisters(filterValues.startDate, filterValues.endDate, filterValues.nameFilter, filterValues.typeFilter, filterValues.categoryFilter);
	};

	const handleSessionExpired = () => {
		sessionExpired()
	};

	const handleMessageAlert = (haveError: boolean | null, message: string | null) => {
		setHaveError(haveError ? true : false);
		setMessage(`${message}`)
		setTimeout(() => {
			setMessage('');
		}, 1500);
	};

	const handleErrorSetting = (error: any) => {
		console.error(error);
		if (error.status === 401) {
			sessionExpired()
		} else {
			setHaveError(true)
			setMessage(`Error: ${error.message}`)
		}
		setTimeout(() => {
			setMessage('')
		}, 1500);
	}

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
							{showRegistersList ? (

								<RegistersList
									registers={registers}
									categories={categories}
									onEditRegister={handleEdit}
									onDeleteRegister={handleDelete}
									onFilter={handleFilter}
									filters={filterValues}
								/>
							) : (
								<RegisterForm
									isModalOpen={isModalOpen}
									onCloseModal={handleCloseModal}
									key={modalKey}
									selectedId={selectedRegisterId}
									isEditing={!!selectedRegisterId}
									onMessage={handleMessageAlert}
									sessionValid={handleSessionExpired}
									categories={categories}
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


export default RegistersPage;
