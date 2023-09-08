import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../../interfaces/user.interface';
import UserProfileForm from '../components/loged/profile/userFormComponent';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/authContext';
import Alert from '../components/messageAlertComponent';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import { editUser, getUser, getUserId, validToken } from '../api/users';

const ProfilePage: React.FC = () => {

  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [message, setMessage] = useState('');
  const [haveError, setHaveError] = useState(false);
  const [user, setUser] = useState<User>();
  const [userId, setUserID] = useState(0);

  const sessionExpired = () => {
    setIsLoading(false);
    setHaveError(true)
    setMessage(`Sessão expirada, você será redirecionado`)
    setIsAuthenticated(false)
    setTimeout(() => {
      setMessage('')
    }, 1500);
    router.push('/')
    return;
  }

  const fetchUser = async () => {
    setIsLoading(true);
    const isValid = await validToken(token);

    if (!isValid) {
      sessionExpired();
      return;
    }

    try {
      const id = await getUserId(token)
      const data = await getUser(id, token)
      setUser(data)
      setUserID(data.id)
    } catch (error) {
      defaultError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (
    id: number,
    name: string,
    email: string,
    username: string
  ) => {
    try {
      await editUser(token, id, name, email, username)
      setHaveError(false);
      setMessage('Ação realizada com sucesso')
      setTimeout(() => {
        setMessage('');
      }, 1500);
    } catch (error) {
      defaultError(error)
    } finally {
      setIsLoading(false);

      fetchUser()
    }
  }

  const defaultError = (error: any) => {
    if (!isNaN(error.response?.data)) {
      const response = error.response.data;
      if (response.status == 403) {
        setHaveError(true)
        setMessage(`Erro: ${response.status} - Mensagem: ${response.error}`)
      }
      if (response.status == 401 || error.status == 401) {
        sessionExpired();
      }
    }
    if (isNaN(error.response.data)) {
      if (error.status == 401) {
        sessionExpired();
      } else {
        setHaveError(true)
        setMessage(`Erro Desconhecido - Mensagem: ${error}`)
      }
    }

  }

  const handleUpdateUser = async (updatedUser: User) => {
    setIsLoading(true);
    const isValid = await validToken(token);
    if (!isValid) {
      sessionExpired();
      return;
    }
    await update(updatedUser.id, updatedUser.name, updatedUser.email, updatedUser.username)
  };

  useEffect(() => {
    fetchUser()
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          {isAuthenticated ? (
            <>
              {user ? (
                <div className="container mx-auto mt-8">
                  <UserProfileForm user={user} onUpdateUser={handleUpdateUser} disableBtn={isLoading} />
                </div>
              ) : (<></>)}
            </>
          ) : (<></>)}
        </>
      )
      }
      <Alert isOpen={!!message} onClose={() => setMessage('')} message={message} isMessageError={haveError} />
    </>
  );
};

export default ProfilePage;
