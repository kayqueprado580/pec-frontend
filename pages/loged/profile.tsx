import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { User } from '../../interfaces/user.interface';
import UserProfileForm from '../components/loged/profile/userFormComponent';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/authContext';
import Alert from '../components/messageAlertComponent';
import Loading from '../components/loadingComponent';
import Navbar from '../components/navbarComponent';
import { getUser, getUserId, validToken } from '../api/users';

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
    setHaveError(true)
    setMessage(`Sessão expirada, você será redirecionado`)
    setIsAuthenticated(false)
    setTimeout(() => {
      setMessage('')
    }, 1500);
    router.push('/')
    return;
  }

  const fetchUsers = async () => {
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
      console.error(error);
      setHaveError(true);
      setMessage(`Error: ${error}`)
      setTimeout(() => {
        setMessage('');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Implemente a lógica de atualização do usuário aqui
    console.log('Usuário atualizado:', updatedUser);
  };

  useEffect(() => {
    fetchUsers()
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
                  <UserProfileForm user={user} onUpdateUser={handleUpdateUser} />
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
