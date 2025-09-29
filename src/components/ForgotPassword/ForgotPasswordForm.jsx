// components/Auth/ForgotPasswordForm.jsx

import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordForm({ setEmail, setStep }) {
  const [currentEmail, setCurrentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/send-reset-password-otp`,
        { email: currentEmail }
      );
      setEmail(currentEmail);
      setStep(2); // Lanjut ke langkah verifikasi OTP
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the reset code.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send OTP.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl'
    >
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Forgot Password?</h1>
        <p className='mt-2 text-gray-600'>
          Don{"'"}t worry! We{"'"}ll help you reset your password.
        </p>
      </div>
      <div>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='Enter your email'
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <Button type='submit' disabled={isLoading} className='w-full text-white'>
        {isLoading ? <Loader2 className='animate-spin' /> : 'Next'}
      </Button>
    </form>
  );
}
