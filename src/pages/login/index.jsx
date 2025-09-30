import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
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
        window.location.href = '/';
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Failed',
          description:
            error?.response?.data?.message ||
            'Email or password incorrect. Please try again.',
        });
        setLoading(false);
      });
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-4 py-8 bg-no-repeat bg-cover bg-block-background'>
      <div className='w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-lg md:rounded-bl-[36px] md:rounded-tr-[36px] shadow-lg bg-background'>
        {/* Left Panel */}
        <div className='flex flex-col items-center justify-center w-full p-8 text-center md:w-1/2 md:px-12 md:py-12 text-background bg-primary md:rounded-tr-[36px]'>
          <div className='w-full max-w-xs'>
            <h2 className='mb-2 text-2xl font-bold'>
              Welcome Back to Cyclefy!
            </h2>
            <p className='mb-6 text-sm'>
              Don{"'"}t have an account? Join our community to start making a
              difference.
            </p>
            <Button
              onClick={() => (window.location.href = '/register')}
              className='w-full mb-6 bg-background text-primary hover:bg-white'
            >
              Sign Up
            </Button>
          </div>
          <div className='hidden bg-logo bg-no-repeat bg-cover w-[136px] aspect-[135/40] md:block mt-4'></div>
        </div>

        {/* Right Panel */}
        <div className='flex items-center justify-center w-full p-8 md:w-1/2 md:px-12 md:py-12 bg-background'>
          <form onSubmit={handleSubmit} className='w-full max-w-md'>
            <h1 className='mb-6 text-2xl font-bold text-center text-text-primary md:text-left'>
              Sign In To Cyclefy
            </h1>

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Email Address / Username
            </label>
            <Input
              name='identifier'
              value={form.identifier}
              onChange={handleChange}
              placeholder='Enter your email or username'
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

            <div className='flex flex-col items-start gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between'>
              <label className='flex items-center gap-2 text-sm text-text-primary'>
                <Checkbox
                  checked={form.remember}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, remember: checked }))
                  }
                />
                Remember me
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
              <FaFacebookF className='text-[#1877F2]' />
              <FcGoogle />
              <FaXTwitter className='text-black' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
