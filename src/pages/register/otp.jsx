import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function RegisterOtpPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Email sekarang hanya diambil dari query parameter
  const { email } = router.query;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

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
    if (!email || otp.length < 4) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter the complete 4-digit OTP.',
      });
      return;
    }
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HOST}/verify-email`, {
        email,
        otp,
      });
      toast({
        title: 'Success! 🎉',
        description: 'Your email has been verified. Please log in.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed ❌',
        description:
          error.response?.data?.message ||
          'Invalid or expired OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    setLoading(true);
    setCanResend(false);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/resend-email-verification-otp`,
        { email }
      );
      toast({
        title: 'OTP Sent',
        description: 'A new OTP has been sent to your email.',
      });
      setResendCooldown(30);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Resend OTP',
        description: error.response?.data?.message || 'Something went wrong.',
      });
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-no-repeat bg-cover bg-block-background'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Verify your email address</h1>
          <p className='mt-2 text-gray-600'>
            We{"'"}ve sent a verification code to{' '}
            <span className='font-semibold'>{email || 'your email'}</span>.
            Please check your inbox and enter the code below to continue.
          </p>
        </div>

        <div className='flex justify-center'>
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className='text-sm text-center'>
          {"Didn't receive a code? "}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className='font-semibold text-primary disabled:text-gray-400 disabled:cursor-not-allowed hover:underline'
          >
            {canResend ? 'Resend' : `Resend in ${resendCooldown}s`}
          </button>
        </div>

        <Button onClick={handleVerify} disabled={loading} className='w-full'>
          {loading ? <Loader2 className='animate-spin' /> : 'Verify Email'}
        </Button>
      </div>
    </div>
  );
}
