import { useState, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
import Loading from './loadingComponent';
import Alert from './messageAlertComponent';
// import { useAuth } from '../contexts/authContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CreateFormUser: React.FC = () => {
	// const apiUrl = process.env.API_URL || '';
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [username, setUsername] = useState<string>('');
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	// const router = useRouter();
	// const { setToken } = useAuth();


	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

	};

	const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div>
			<div className="text-center">
				<form
					onSubmit={handleSubmit}
					className="grid gap-6 bg-white rounded-lg shadow-md mx-auto max-w-sm p-8"
				>

					<div>
						<label
							htmlFor="name"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Nome
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={name}
							onChange={handleNameChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Seu Nome"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={handleEmailChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="example@example.com"
							required
						/>
					</div>

					<div>
						<label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Usuário
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={handleUsernameChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="user123@@"
							required
						/>
					</div>

					<div className="relative">
						<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Senha
						</label>
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							value={password}
							onChange={handlePasswordChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="•••••••••"
							required
						/>
						<button
							type="button"
							className="absolute right-2 bottom-2 text-gray-500 dark:text-white"
							onClick={toggleShowPassword}
						>
							{showPassword ? (
								<FontAwesomeIcon icon={faEyeSlash} />
							) : (
								<FontAwesomeIcon icon={faEye} />
							)}
						</button>
					</div>

					{/* <div>
						<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Senha
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={handlePasswordChange}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="•••••••••"
							required
						/>
					</div> */}

					<div className="text-center">
						{isLoading ? (
							<Loading />
						) : (
							<>

								<button
									type="submit"
									className="text-gray-800 bg-light-default-green hover:bg-default-green hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									Cadastrar
								</button>
							</>
						)}
					</div>

				</form>
			</div >
			<Alert isOpen={!!error} onClose={() => setError('')} message={error} isMessageError={true} />
		</div >
	);
};

export default CreateFormUser;