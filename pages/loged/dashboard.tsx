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
import Report from "../components/loged/dashboard/reportComponent";
import PieChart from "../components/loged/dashboard/pieComponent";

const DashboardPage: React.FC = () => {
	const router = useRouter();
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [dashboardData, setDashboard] = useState<Dashboard>();
	const [message, setMessage] = useState('');
	const [haveError, setHaveError] = useState(false);
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
		setIsAuthenticated(false)
		setHaveError(true)
		setMessage(`Sessão expirada, você será redirecionado`)
		setTimeout(() => {
			setMessage('')
		}, 1500);
		router.push('/')
		return;
	}

	const fetchDashboard = async (startDate?: string, endDate?: string) => {
		setIsLoading(true);
		const isValid = await validToken(token);

		if (isValid) {
			try {
				const data = await getDataDashboard(token, startDate, endDate)
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
		start: string,
		end: string,
		yearStart: string,
		monthStart: string,
		yearEnd: string,
		monthEnd: string,
	) => {
		setStartDate(start);
		setEndDate(end);
		setIsLoading(true);
		fetchDashboard(start, end)
		setFilterValues({
			startDate: start,
			endDate: end,
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
					{isAuthenticated ? (
						<>
							{!dashboardData ? (
								<>
									<h2 className="pt-12 text-2xl font-bold mb-4 text-center">Sem dados no momento...</h2>
								</>
							) : (
								<div className="grid grid-cols-4 gap-4">
									<div>
										<Card title="Total de Receitas" value={dashboardData.dashboard.total.revenue} borderColor="#15df15" />
									</div>
									<div>
										<Card title="Total de Despesas" value={dashboardData.dashboard.total.expense} borderColor="#F71212" />
									</div>
									<div>
										<Card title="Saldo" value={dashboardData.dashboard.total.balance} borderColor="#1288f7" />
									</div>
									<div>
										<Card
											title="Balanço"
											value={dashboardData?.dashboard.total.positiveBalance ? 'Positivo' : 'Negativo'}
											borderColor={dashboardData.dashboard.total.positiveBalance ? '#15df15' : '#F71212'}
										/>
										<PieChart data={dashboardData.report}/>
										{/* <Report report={dashboardData.report} chartType="pie" /> */}
										{/* <Report report={dashboardData.report} chartType="bar" /> */}
									</div>
								</div>
							)}
						</>
					) : (<></>)}
				</>
			)}
			<Alert isOpen={!!message} onClose={() => setMessage('')} message={message} isMessageError={haveError} />
		</div>
	)
};

export default DashboardPage;