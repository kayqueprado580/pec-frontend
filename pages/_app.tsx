import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { AuthProvider } from './contexts/authContext'; // Importe o AuthProvider

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    document.title = 'P.E Control';

    const handleRouteChange = (url: any) => {
      document.title = 'P.E Control';
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider >
  )
}

export default MyApp
