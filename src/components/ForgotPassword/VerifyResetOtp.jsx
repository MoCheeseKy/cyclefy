// components/Auth/VerifyResetOtp.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';

export default function VerifyResetOtp({ email, setOtp, setStep }) {
  const [currentOtp, setCurrentOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (currentOtp.length < 4) {
      toast({
        variant: 'destructive',
        title: 'OTP Tidak Valid',
        description: 'Silakan masukkan kode 4 digit.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/verify-reset-passsword-email`,
        { email, otp: currentOtp }
      );
      setOtp(currentOtp);
      setStep(3);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verifikasi Gagal',
        description: error.response?.data?.message || 'OTP tidak valid.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/send-reset-password-otp`,
        { email }
      );
      toast({
        title: 'OTP Terkirim Ulang',
        description: 'OTP baru telah dikirim.',
      });
      setResendCooldown(30);
    } catch (error) {
      setCanResend(true);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal mengirim ulang OTP.',
      });
    }
  };

  return (
    <div className='w-full max-w-md p-6 space-y-6 bg-white shadow-lg sm:p-8 rounded-2xl'>
      <div className='text-center'>
        <h1 className='text-xl font-bold md:text-2xl'>Verifikasi Email Anda</h1>
        <p className='mt-2 text-sm text-gray-600 md:text-base'>
          Kami telah mengirimkan kode ke{' '}
          <span className='font-semibold'>{email}</span>.
        </p>
      </div>
      <div className='flex justify-center'>
        <InputOTP maxLength={4} value={currentOtp} onChange={setCurrentOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className='text-sm text-center'>
        Tidak menerima kode?{' '}
        <button
          onClick={handleResend}
          disabled={!canResend}
          className='font-semibold text-primary disabled:text-gray-400'
        >
          {canResend ? 'Kirim Ulang' : `Kirim ulang dalam ${resendCooldown}s`}
        </button>
      </div>
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className='w-full text-white bg-primary hover:bg-primary/90'
      >
        {isLoading ? <Loader2 className='animate-spin' /> : 'Verifikasi'}
      </Button>
    </div>
  );
}
