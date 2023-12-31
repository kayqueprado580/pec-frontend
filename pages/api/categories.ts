import axios from 'axios';

const apiUrl = process.env.API_URL;

export const getCategory = async (id: number, token: string | null) => {
	try {
		const response = await axios.get(`${apiUrl}/v1/categories/${id}`, {
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

export const getCategories = async (token: string | null) => {
	try {
		const response = await axios.get(`${apiUrl}/v1/categories?take=999999`, {
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

export const deleteCategory = async (id: number, token: string | null) => {
	try {
		const response = await axios.delete(`${apiUrl}/v1/categories/${id}`, {
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

export const editCategory = async (id: number, token: string | null, name: string, description: string) => {
	try {
		const response = await axios.patch(
			`${apiUrl}/v1/categories/${id}`,
			{
				name,
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

export const createCategory = async (token: string | null, name: string, description: string) => {
	try {
		const response = await axios.post(
			`${apiUrl}/v1/categories`,
			{
				name,
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
		const response = await axios.get(`${apiUrl}/v1/categories?take=2`, {
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