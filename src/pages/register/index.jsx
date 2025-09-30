import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

export default function SignUp() {
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
        title: 'Password mismatch ❌',
        description:
          'Please ensure password and confirm password are the same.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/register`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }
      );

      toast({
        title: 'Registration Successful 🎉',
        description:
          response.data.message || 'Please check your email for the OTP code.',
      });

      window.location.href = `/register/otp?email=${encodeURIComponent(
        form.email
      )}`;
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed ❌',
        description:
          error.response?.data?.message ||
          'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-4 py-8 bg-no-repeat bg-cover bg-block-background'>
      <div className='w-full max-w-sm md:max-w-4xl flex flex-col-reverse md:flex-row overflow-hidden rounded-lg md:rounded-bl-[36px] md:rounded-tr-[36px] shadow-lg bg-primary'>
        {/* Left Panel (Form) */}
        <div className='w-full bg-background p-8 md:px-12 md:py-12 flex items-center justify-center md:w-1/2 md:rounded-tr-[36px]'>
          <form onSubmit={handleSubmit} className='w-full max-w-md'>
            <h1 className='mb-6 text-2xl font-bold text-center text-text-primary md:text-left'>
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
              <FaFacebookF className='text-[#1877F2]' />
              <FcGoogle />
              <FaXTwitter className='text-black' />
            </div>
          </form>
        </div>

        {/* Right Panel (Info) */}
        <div className='flex flex-col items-center justify-center w-full p-8 text-center md:w-1/2 md:px-12 md:py-12 bg-primary text-background'>
          <div className='w-full max-w-xs'>
            <h2 className='mb-2 text-2xl font-bold'>Welcome to Cyclefy!</h2>
            <p className='mb-6 text-sm'>
              Already have an account? Sign in to continue your journey with us.
            </p>
            <Button
              onClick={() => (window.location.href = '/login')}
              className='w-full mb-6 bg-background text-primary hover:bg-white'
            >
              Sign In
            </Button>
          </div>
          <div className='hidden bg-logo bg-no-repeat bg-cover w-[136px] aspect-[135/40] md:block mt-4'></div>
        </div>
      </div>
    </div>
  );
}
