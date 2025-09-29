import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

import axios from 'axios';

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/users/login`, {
        identifier: form.identifier,
        password: form.password,
      })
      .then((response) => {
        localStorage.setItem('cyclefy_user_token', response?.data?.token);
        localStorage.setItem(
          'cyclefy_user_data',
          JSON.stringify(response?.data?.data)
        );
        toast({
          title: 'Success',
          description: response?.data?.message || 'Login successful!',
        });
        setLoading(false);
        router.push('/');
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Failed',
          description:
            error?.data?.message || 'Email atau password salah. Coba lagi.',
        });
        setLoading(false);
      });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-no-repeat bg-cover bg-block-background'>
      <div className='w-[970px] max-w-full flex overflow-hidden rounded-bl-[36px] rounded-tr-[36px] shadow-lg bg-background'>
        {/* Left Panel */}
        <div className='flex flex-col items-center justify-center w-1/2 px-12 py-12 text-background rounded-tr-[36px] bg-primary'>
          <div className='max-w-xs text-center'>
            <h2 className='mb-2 text-2xl font-bold'>
              Welcome Back to Cyclefy!
            </h2>
            <p className='mb-6 text-sm'>Lorem Ipsum dolor sit amet.</p>
            <p className='mb-2 text-sm'>Dont have an account? </p>
            <Button
              onClick={() => router.push('/register')}
              className='w-full mb-6 bg-background text-primary hover:bg-white'
            >
              Sign In
            </Button>
          </div>
          <div className='bg-logo bg-no-repeat bg-cover w-[136px] aspect-[135/40]'></div>
        </div>

        {/* Right Panel */}
        <div className='flex items-center justify-center w-1/2 px-12 py-12 bg-background'>
          <form onSubmit={handleSubmit} className='w-full max-w-md'>
            <h1 className='mb-6 text-2xl font-bold text-text-primary'>
              Sign In To Cyclefy
            </h1>

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Email Address / Username
            </label>
            <Input
              name='identifier'
              value={form.identifier}
              onChange={handleChange}
              placeholder='Enter your email address or username'
              className='mb-4'
            />

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Password
            </label>
            <Input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='mb-2'
            />

            <div className='flex items-center justify-between mb-6'>
              <label className='flex items-center gap-2 text-sm text-text-primary'>
                <Checkbox
                  checked={form.remember}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, remember: checked }))
                  }
                />
                Remember me?
              </label>
              <Link
                href='/login/forgot-password'
                className='text-sm text-action hover:underline'
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type='submit'
              className='w-full mb-6 bg-primary text-background hover:opacity-90'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>

            <div className='flex items-center gap-4 mb-6'>
              <hr className='flex-1 border-t' />
              <span className='text-sm text-text-subtle'>Or sign in with</span>
              <hr className='flex-1 border-t' />
            </div>

            <div className='flex justify-center gap-4 text-xl text-text-primary'>
              <FaFacebook className='cursor-pointer hover:text-action' />
              <FaGoogle className='cursor-pointer hover:text-action' />
              <FaTwitter className='cursor-pointer hover:text-action' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
