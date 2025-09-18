import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import axios from 'axios';

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password tidak cocok ❌',
        description: 'Pastikan password dan konfirmasi password sama.',
      });
      setLoading(false);
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
      .then((response) => {
        console.log('Registration successful:', response.data);
        console.log('Sign Up data:', form);

        toast({
          title: 'Registrasi berhasil 🎉',
          description: 'Akun kamu sudah dibuat. Silakan login.',
        });

        router.push('/login');
      })
      .catch((error) => {
        console.error('Registration failed:', error);

        toast({
          variant: 'destructive',
          title: 'Registrasi gagal ❌',
          description:
            error.response?.data?.message ||
            'Terjadi kesalahan. Silakan coba lagi.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='w-[970px] max-w-full flex overflow-hidden rounded-bl-[36px] rounded-tr-[36px] shadow-lg bg-primary'>
        {/* Left Panel */}
        <div className='w-1/2 bg-background px-12 py-12 flex items-center justify-center rounded-tr-[36px]'>
          <form onSubmit={handleSubmit} className='w-full max-w-md'>
            <h1 className='mb-6 text-2xl font-bold text-text-primary'>
              Sign Up To Cyclefy
            </h1>

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Username
            </label>
            <Input
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder='Create your username'
              className='mb-4'
            />

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Email Address
            </label>
            <Input
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Enter your email address'
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
              placeholder='Create your password'
              className='mb-4'
            />

            <label className='block mb-2 text-sm font-semibold text-text-primary'>
              Confirm Password
            </label>
            <Input
              type='password'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder='Re-enter your password'
              className='mb-6'
            />

            <Button
              type='submit'
              className='w-full mb-6 bg-primary text-background hover:opacity-90'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>

            <div className='flex items-center gap-4 mb-6'>
              <hr className='flex-1 border-t' />
              <span className='text-sm text-text-subtle'>or sign up with</span>
              <hr className='flex-1 border-t' />
            </div>

            <div className='flex justify-center gap-4 text-xl text-text-primary'>
              <FaFacebook className='cursor-pointer hover:text-action' />
              <FaGoogle className='cursor-pointer hover:text-action' />
              <FaTwitter className='cursor-pointer hover:text-action' />
            </div>
          </form>
        </div>

        {/* Right Panel */}
        <div className='flex flex-col items-center justify-center w-1/2 px-12 py-12 bg-primary text-background'>
          <div className='max-w-xs text-center'>
            <h2 className='mb-2 text-2xl font-bold'>Welcome to Cyclefy!</h2>
            <p className='mb-6 text-sm'>Lorem Ipsum dolor sit amet.</p>
            <p className='mb-2 text-sm'>Already have an account?</p>
            <Button
              onClick={() => router.push('/login')}
              className='w-full mb-6 bg-background text-primary hover:opacity-90'
            >
              Sign In
            </Button>
          </div>
          <div className='flex items-center gap-3 mt-12'>
            <div className='w-8 h-8 bg-background' />
            <span className='text-lg font-bold text-background'>Cyclefy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
