import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import { Register } from '../../interfaces/register.interface';
import { getRegisters, deleteRegister, validToken } from '../api/registers';
import Alert from '../components/messageAlertComponent';
import { useAuth } from '../contexts/authContext';
import RegistersList from '../components/loged/registers/registersListComponent';

const RegistersPage: React.FC = () => {
	const router = useRouter();
	const { token } = useAuth();
	const [registers, setRegisters] = useState<Register[]>([]);
	const [showRegistersList, setShowRegistersList] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [selectedRegisterId, setSelectedRegisterId] = useState<number | null>(null);
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

	const fetchRegisters = async (startDate?: string | null, endDate?: string | null) => {
		console.log(`fetchRegisters`)
		setIsLoading(true);
		const isValid = await validToken(token);

		if (isValid) {

			requestRegisters(startDate, endDate)
			// try {
			// 	const data = await getRegisters(token, startDate, endDate)
			// 	setRegisters(data);
			// 	setShowRegistersList(true);
			// } catch (error: any) {
			// 	console.error(error);
			// 	if (error.status == 401) {
			// 		sessionExpired();
			// 	} else {
			// 		setHaveError(true);
			// 		setMessage(`Error: ${error}`)
			// 	}
			// 	setTimeout(() => {
			// 		setMessage('');
			// 	}, 1500);
			// } finally {
			// 	setIsLoading(false);
			// }
		}
		else {
			sessionExpired();
		}

	};

	useEffect(() => {
		fetchRegisters()
	}, [router]);


	const requestRegisters = async (
		startDate?: string | null,
		endDate?: string | null
	) => {
		try {
			const data = await getRegisters(token, startDate, endDate)
			setRegisters(data);
			setShowRegistersList(true);
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
	const handleFilter = (startDate: string | null, endDate: string | null) => {
		console.log(`(handleFilter) startDate: ${startDate} - endDate: ${endDate}`)
		requestRegisters(startDate, endDate);
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
		setSelectedRegisterId(null)
		setShowRegistersList(false);
		setIsModalOpen(true);
	};

	// const handleCloseModal = () => {
	// 	setIsModalOpen(false);
	// 	setModalKey((prevKey) => prevKey + 1);
	// 	fetchRegisters();
	// };

	// const handleSessionExpired = () => {
	// 	sessionExpired()
	// };

	// const handleMessageAlert = (haveError: boolean, message: string | null) => {
	// 	setHaveError(haveError);
	// 	setMessage(`${message}`)
	// 	setTimeout(() => {
	// 		setMessage('');
	// 	}, 1500);
	// };

	// const handleReloadData = () => {
	// 	setShouldReloadData(true);
	// };

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

								<RegistersList registers={registers} onEditRegister={handleEdit} onDeleteRegister={handleDelete} onFilterByDate={handleFilter} />
							) : (
								// <RegisterForm
								// 	isModalOpen={isModalOpen}
								// 	onCloseModal={handleCloseModal}
								// 	key={modalKey}
								// 	selectedId={selectedRegisterId}
								// 	isEditing={!!selectedRegisterId}
								// 	onMessage={handleMessageAlert}
								// 	sessionValid={handleSessionExpired}
								// />
								<></>
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
