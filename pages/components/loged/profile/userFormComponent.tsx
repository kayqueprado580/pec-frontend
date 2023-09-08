
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { User } from '../../../../interfaces/user.interface';
import { isValidEmail, isValidPassword, isValidString } from '../../../services/inputs.validator';
import Loading from '../../loadingComponent';

interface UserProfileFormProps {
	user: User;
	onUpdateUser: (updatedUser: User) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, onUpdateUser }) => {
	const [name, setName] = useState(user.name);
	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState(user.password);
	const [usernameError, setUsernameError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsSubmitting(true);

		if (!checkInputName() || !checkInputEmail() || !checkInputUsername() || !checkInputPassword()) {
			setIsSubmitting(false);
			return;
		}

		const updatedUser: User = {
			...user,
			email,
			name,
			username,
			password
		};
		onUpdateUser(updatedUser);
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

	const checkInputName = () => {
		const nameLenght = name.trim().length;
		if (!isValidString(name)) {
			setNameError('Campo Obrigatório.');
			return false;
		}
		if (nameLenght > 10) {
			setNameError('Nome não pode ter mais de 10 caracteres.');
			return false;
		}
		setNameError('');
		return true;
	}

	const checkInputEmail = () => {
		if (!isValidEmail(email)) {
			setEmailError('Email inválido.');
			return false;
		}
		setEmailError('');
		return true;
	}

	const checkInputUsername = () => {
		const usernameLength = username.trim().length;
		if (!isValidString(username)) {
			setUsernameError('Campo Obrigatório.');
			return false;
		}
		if (usernameLength > 10) {
			setUsernameError('Username não pode ter mais de 10 caracteres.');
			return false;
		}
		setUsernameError('');
		return true;

	}

	const checkInputPassword = () => {
		if (!isValidPassword(password)) {
			setPasswordError('A senha deve ter no mínimo 4 caracteres e no máximo 8 caracteres. Necessário incluir pelo menos 1 letra maiúscula, 1 letra minúscula e um dígito númerico.');
			return false;
		}
		setPasswordError('');
		return true;
	}

	useEffect(() => {
		setName(user.name)
		setEmail(user.email)
		setUsername(user.username)
		setPassword(user.password)
	}, []);

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="grid gap-6 bg-white rounded-lg shadow-md mx-auto max-w-sm p-8"
			>
				<h1 className="text-lg font-semibold text-center">Ola, {user.name}</h1>
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
					/>
					{nameError && <p className="text-red-500">{nameError}</p>}
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
					/>
					{emailError && <p className="text-red-500">{emailError}</p>}
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
					/>
					{usernameError && <p className="text-red-500">{usernameError}</p>}
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
					{passwordError && <p className="text-red-500">{passwordError}</p>}
				</div>

				<div className="text-center">
					{isLoading ? (
						<Loading />
					) : (
						<>
							<button
								type="submit"
								className="text-gray-800 bg-light-default-green hover:bg-default-green hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								disabled={isSubmitting}
							>
								Salvar Alterações
							</button>
						</>
					)}
				</div>

			</form>
		</>
	);
};

export default UserProfileForm;
