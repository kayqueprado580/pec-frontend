import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loading from './loadingComponent';
import Alert from './messageAlertComponent';

interface LoginResponse {
  access_token: string;
}

const Login: React.FC = () => {
  const apiUrl = process.env.API_URL || '';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(`${apiUrl}/v1/login`, {
        username,
        password,
      });
      if (response.data.access_token) {
        console.log('Token JWT:', response.data.access_token);
        sessionStorage.setItem('accessToken', response.data.access_token);
        console.log('Login Sucess');
        router.push('/loged/categories');
      } else {
        console.log('response:', response.data);
        console.log('Login falhou');
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 p-8 bg-white rounded-lg shadow-md max-w-xl"
        >
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="user123@@"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
            {/*
              TO DO
              - fazer uma rota para esqueci a senha.
            */}
            <a href='/' target='blank'><h3 className="mt-4 block text-sm font-light text-gray-900 dark:text-white">esqueci a senha!</h3></a>
          </div>

          <div className="flex space-x-4">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {/*
              TO DO
              - fazer rota de cadastro usuário novo.
                */}
                <a
                  href="/rota-de-cadastro"
                  className="text-gray-800 bg-light-default-green hover:bg-default-green hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cadastrar
                </a>

                <button
                  type="submit"
                  className="text-gray-800 bg-light-default-green hover:bg-default-green hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Entrar
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

export default Login;