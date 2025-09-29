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
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/verify-reset-passsword-email`,
        { email, otp: currentOtp }
      );
      setOtp(currentOtp);
      setStep(3); // Lanjut ke langkah set password baru
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid OTP.',
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
      toast({ title: 'OTP Resent', description: 'A new OTP has been sent.' });
      setResendCooldown(30);
    } catch (error) {
      setCanResend(true);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to resend OTP.',
      });
    }
  };

  return (
    <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Verify your email address</h1>
        <p className='mt-2 text-gray-600'>
          We{"'"}ve sent a code to{' '}
          <span className='font-semibold'>{email}</span> to reset your password.
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
        Didn{"'"}t receive a code?{' '}
        <button
          onClick={handleResend}
          disabled={!canResend}
          className='font-semibold text-primary disabled:text-gray-400'
        >
          {canResend ? 'Resend' : `Resend in ${resendCooldown}s`}
        </button>
      </div>
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className='w-full text-white'
      >
        {isLoading ? <Loader2 className='animate-spin' /> : 'Verify Email'}
      </Button>
    </div>
  );
}
