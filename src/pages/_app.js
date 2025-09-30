import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('cyclefy_user_token');

    const protectedRoutes = ['/user', '/features'];

    const needsAuth = protectedRoutes.some((path) =>
      router.pathname.startsWith(path)
    );

    if (needsAuth && !token) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default App;
