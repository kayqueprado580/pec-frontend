import axios, { AxiosError } from 'axios';

interface CustomError {
	status: number;
	message: string;
}

export async function handleApiRequest<T>(
	requestFn: () => Promise<T>
): Promise<T> {
	try {
		return await requestFn();
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			const axiosError: AxiosError = error;
			const customError: CustomError = {
				status: axiosError.response?.status || 500,
				message: axiosError.message || 'Erro desconhecido',
			};
			throw customError;
		} else {
			const customError: CustomError = {
				status: 500,
				message: error.message || 'Erro desconhecido',
			};
			throw customError;
		}
	}
}
