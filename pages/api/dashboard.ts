import axios from 'axios';

const apiUrl = process.env.API_URL;

export const getDataDashboard = async (
	id: number,
	token: string | null,
	startDate?: string | null,
	endDate?: string | null,
) => {

	let endpoint = `${apiUrl}/v1/dashboard`
	if (startDate && startDate != '')
		endpoint += `&startDate=${startDate}`

	if (endDate && endDate != '')
		endpoint += `&endDate=${endDate}`

	try {
		const response = await axios.get(`${apiUrl}/v1/dashboard`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		console.error('Erro ao obter os dados:', error);
		throw error;
	}
};
