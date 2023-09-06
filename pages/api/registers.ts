import axios from 'axios';

const apiUrl = process.env.API_URL;

export const getRegister = async (id: number, token: string | null) => {
	try {
		const response = await axios.get(`${apiUrl}/v1/registers/${id}`, {
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

export const getRegisters = async (token: string | null, startDate?: string | null, endDate?: string | null) => {
	console.log('getRegisters')
	try {
		let endpoint = `${apiUrl}/v1/registers?take=999999`
		if (startDate && startDate != '')
			endpoint += `&startDate=${startDate}`

		if (endDate && startDate != '')
			endpoint += `&endDate=${endDate}`

		console.log(`endpoint: ${endpoint}`)
		const response = await axios.get(`${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(`response.data: ${response.data}`)

		return response.data;
	} catch (error) {
		console.error('Erro ao obter os dados:', error);
		throw error;
	}
};

export const deleteRegister = async (id: number, token: string | null) => {
	try {
		const response = await axios.delete(`${apiUrl}/v1/registers/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		console.error('erro ao excluir:', error);
		throw error;
	}
};

export const editRegister = async (
	id: number,
	token: string | null,
	name: string,
	type: string,
	value: string,
	date: Date,
	pago: boolean,
	categoryId: number,
	description: string
) => {

	try {
		const response = await axios.patch(
			`${apiUrl}/v1/registers/${id}`,
			{
				name,
				type,
				value,
				date,
				pago,
				categoryId,
				description

			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error('erro ao editar:', error);
		throw error;
	}
};

export const createRegister = async (
	token: string | null,
	name: string,
	type: string,
	value: string,
	date: Date,
	pago: boolean,
	categoryId: number,
	description: string
) => {

	try {
		const response = await axios.post(
			`${apiUrl}/v1/registers`,
			{
				name,
				type,
				value,
				date,
				pago,
				categoryId,
				description
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error('erro ao criar:', error);
		throw error;
	}
};

export const validToken = async (token: string | null) => {

	if (token) {
		const response = await axios.get(`${apiUrl}/v1/registers?take=2`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.data.status == 401) {
			return false
		} else {
			return true
		}
	}
	return false
};