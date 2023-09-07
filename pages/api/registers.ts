import axios from 'axios';
import { customError } from '../../interfaces/customError.interface';
import { handleApiRequest } from '../../utils/apiUtils';

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

export const getRegisters = async (
	token: string | null,
	startDate?: string | null,
	endDate?: string | null,
	name?: string | null,
	type?: string | null,
	categoryId?: number | null,
) => {

	let endpoint = `${apiUrl}/v1/registers?take=999999`
	if (startDate && startDate != '')
		endpoint += `&startDate=${startDate}`

	if (endDate && endDate != '')
		endpoint += `&endDate=${endDate}`

	if (categoryId && categoryId != 0)
		endpoint += `&category=${categoryId}`

	if (name && name != '')
		endpoint += `&name=${name}`

	if (type && type != '')
		endpoint += `&type=${type}`

	try {
		const data = await handleApiRequest(async () => {
			const response = await axios.get(`${endpoint}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		});

		return data
	} catch (error) {
		console.error('error', error);
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
	date: string,
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
	date: string,
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