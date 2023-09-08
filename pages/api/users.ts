import axios from 'axios';

const apiUrl = process.env.API_URL;

export const getUser = async (id: number, token: string | null) => {
	try {
		const response = await axios.get(`${apiUrl}/v1/users/${id}`, {
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

export const getUserId = async (token: string | null) => {
	try {
		const response = await axios.get(`${apiUrl}/v1/categories?take=1`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data[0].userId;
	} catch (error) {
		console.error('Erro ao obter os dados:', error);
		throw error;
	}
};

export const editUser = async (token: string | null, id: number, name: string, email: string, username: string) => {
	try {
		const response = await axios.patch(
			`${apiUrl}/v1/users/${id}`,
			{
				name,
				email,
				username
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

export const createUser = async (name: string, email: string, username: string, password: string) => {
	try {
		const response = await axios.post(
			`${apiUrl}/v1/users`,
			{
				name,
				email,
				username,
				password
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
		const response = await axios.get(`${apiUrl}/v1/users?take=1`, {
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

interface LoginResponse {
	access_token: string;
}

export const signIn = async (username: string, password: string) => {
	return await axios.post<LoginResponse>(`${apiUrl}/v1/login`, {
		username,
		password,
	});
} 