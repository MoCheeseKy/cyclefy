// components/Auth/ResetPasswordForm.jsx

import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordForm({ email, otp, setStep }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password tidak cocok.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HOST}/reset-password`, {
        email,
        otp,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      setStep(4);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Mengatur Ulang',
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md p-6 space-y-4 bg-white shadow-lg sm:p-8 rounded-2xl'
    >
      <div className='text-center'>
        <h1 className='text-xl font-bold md:text-2xl'>Atur password baru</h1>
        <p className='mt-2 text-sm text-gray-600 md:text-base'>
          Buat password baru yang kuat untuk akun Anda.
        </p>
      </div>
      <div>
        <label className='text-sm font-medium'>Password</label>
        <Input
          type='password'
          placeholder='Buat password baru'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <div>
        <label className='text-sm font-medium'>Konfirmasi Password</label>
        <Input
          type='password'
          placeholder='Masukkan kembali password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <Button
        type='submit'
        disabled={isLoading}
        className='w-full !mt-6 text-white bg-primary hover:bg-primary/90'
      >
        {isLoading ? <Loader2 className='animate-spin' /> : 'Perbarui Password'}
      </Button>
    </form>
  );
}
