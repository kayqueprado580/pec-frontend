import { useEffect, useState } from "react";
import Navbar from "../components/navbarComponent";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/router";
import Loading from "../components/loadingComponent";
import { validToken } from "../api/categories";
import { Dashboard } from "../../interfaces/dashboard.interface";
import Alert from "../components/messageAlertComponent";
import { getDataDashboard } from "../api/dashboard";
import DateFilter from "../components/loged/dashboard/dateFilterComponent";
import Card from "../components/loged/dashboard/cardComponent";

const DashboardPage: React.FC = () => {
	const router = useRouter();
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [dashboardData, setDashboard] = useState<Dashboard>();
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);
	const [selectedYearStart, setSelectedYearStart] = useState('');
	const [selectedMonthStart, setSelectedMonthStart] = useState('');
	const [selectedYearEnd, setSelectedYearEnd] = useState('');
	const [selectedMonthEnd, setSelectedMonthEnd] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filterValues, setFilterValues] = useState({
		startDate: '',
		endDate: '',
		selectedYearStart: '',
		selectedMonthStart: '',
		selectedYearEnd: '',
		selectedMonthEnd: ''
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

	const fetchDashboard = async () => {
		setIsLoading(true);
		const isValid = await validToken(token);

		if (isValid) {
			try {
				const data = await getDataDashboard(token, startDate, endDate)
				console.log(`balance: ${data.dashboard.total.balance}`)
				setDashboard(data);
			} catch (error: any) {
				console.error(error);
				const response = error.response.data;

				if (response.status == 403) {
					setHaveError(true)
					setMessage(`Erro: ${response.status} - Mensagem: ${response.error}`)
				}
				if (response.status == 401 || error.status == 401) {
					sessionExpired();
				}
				if (isNaN(response.status)) {
					setHaveError(true)
					setMessage(`Erro Desconhecido - Mensagem: ${response.message}`)
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

	const handleFilter = (
		startDate: string,
		endDate: string,
		yearStart: string,
		monthStart: string,
		yearEnd: string,
		monthEnd: string,
	) => {
		setIsLoading(true);
		fetchDashboard()
		setFilterValues({
			startDate: startDate,
			endDate: endDate,
			selectedYearStart: yearStart,
			selectedMonthStart: monthStart,
			selectedYearEnd: yearEnd,
			selectedMonthEnd: monthEnd
		})
	};


	useEffect(() => {
		fetchDashboard()
	}, [router]);

	return (
		<div>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<Navbar />
					<DateFilter
						onFilterChange={handleFilter}
						filters={filterValues}
					/>
					<h1>{dashboardData?.dashboard.total.balance}</h1>
					<Card title="red" value={300} borderColor="red-400" />
					<Card title="green" value={400} borderColor="[#F71212]" />
					<Card title="blue" value={200} borderColor="blue-500" />
				</>)}
			<Alert isOpen={!!message} onClose={() => setMessage('')} message={message} isMessageError={haveError} />
		</div>
	)
};

export default DashboardPage;