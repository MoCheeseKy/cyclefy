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
        description: 'Passwords do not match.',
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
      setStep(4); // Lanjut ke halaman sukses
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Reset',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-2xl'
    >
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Set a new password</h1>
        <p className='mt-2 text-gray-600'>
          Create a new strong password for your account.
        </p>
      </div>
      <div>
        <label className='text-sm font-medium'>Password</label>
        <Input
          type='password'
          placeholder='Create new password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <div>
        <label className='text-sm font-medium'>Confirm Password</label>
        <Input
          type='password'
          placeholder='Re-enter password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className='mt-1'
        />
      </div>
      <Button type='submit' disabled={isLoading} className='w-full !mt-6'>
        {isLoading ? <Loader2 className='animate-spin' /> : 'Update Password'}
      </Button>
    </form>
  );
}
