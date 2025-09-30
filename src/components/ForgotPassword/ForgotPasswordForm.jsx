import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Loader2 } from 'lucide-react';

// Step 1: Form untuk memasukkan email
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
      setStep(2);
      toast({
        title: 'OTP Terkirim',
        description: 'Silakan periksa email Anda untuk kode reset.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Gagal mengirim OTP.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md p-6 space-y-6 bg-white shadow-lg sm:p-8 rounded-2xl'
    >
      <div className='text-center'>
        <h1 className='text-xl font-bold md:text-2xl'>Lupa Password?</h1>
        <p className='mt-2 text-sm text-gray-600 md:text-base'>
          Jangan khawatir! Kami akan membantu Anda mengatur ulang password Anda.
        </p>
      </div>
      <div>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='Masukkan email Anda'
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <Button
        type='submit'
        disabled={isLoading}
        className='w-full text-white bg-primary hover:bg-primary/90'
      >
        {isLoading ? <Loader2 className='animate-spin' /> : 'Selanjutnya'}
      </Button>
    </form>
  );
}
