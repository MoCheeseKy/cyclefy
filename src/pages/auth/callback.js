import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export default function OAuthCallback() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Ambil code/token dari query (kalau backend kasih via query)
        const { provider, code } = router.query;

        if (!provider) return;

        // Panggil backend untuk verifikasi callback
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/auth/${provider}/callback?code=${
            code || ''
          }`
        );

        const { token, data, message } = res.data;

        // Simpan token & data user
        localStorage.setItem('cyclefy_user_token', token);
        localStorage.setItem('cyclefy_user_data', JSON.stringify(data));

        toast({
          title: 'Success',
          description: message || 'Login successful!',
        });

        // Redirect ke home
        router.replace('/');
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed ❌',
          description: 'Something went wrong. Please try again.',
        });
        router.replace('/login');
      }
    };

    if (router.isReady) {
      fetchUser();
    }
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <p>Processing authentication...</p>
    </div>
  );
}
