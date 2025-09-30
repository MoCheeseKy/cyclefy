import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

function OtpInputView({
  email,
  otp,
  setOtp,
  handleVerify,
  handleResend,
  loading,
  canResend,
  resendCooldown,
}) {
  return (
    <div className='w-full max-w-md p-6 space-y-6 bg-white shadow-lg sm:p-8 rounded-2xl'>
      <div className='text-center'>
        <h1 className='text-xl font-bold md:text-2xl'>
          Verify your email address
        </h1>
        <p className='mt-2 text-sm text-gray-600 md:text-base'>
          We{"'"}ve sent a verification code to{' '}
          <span className='font-semibold'>{email || 'your email'}</span>. Please
          enter the code below.
        </p>
      </div>

      <div className='flex justify-center'>
        <InputOTP maxLength={4} value={otp} onChange={(value) => setOtp(value)}>
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

      <Button
        onClick={handleVerify}
        disabled={loading}
        className='w-full bg-primary hover:bg-primary/90'
      >
        {loading ? <Loader2 className='animate-spin' /> : 'Verify Email'}
      </Button>
    </div>
  );
}

function RegisterSuccessView() {
  const handleSignInClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className='w-full max-w-md p-6 text-center bg-white shadow-lg sm:p-8 rounded-2xl'>
      <CheckCircle2 className='w-16 h-16 mx-auto text-green-500' />
      <h1 className='mt-4 text-xl font-bold md:text-2xl'>
        Email Verification Successful
      </h1>
      <p className='mt-2 text-sm text-gray-600 md:text-base'>
        Your email has been successfully verified. You can now proceed to sign
        in to your account.
      </p>
      <Button
        onClick={handleSignInClick}
        className='w-full mt-6 bg-primary hover:bg-primary/90'
      >
        Sign In
      </Button>
    </div>
  );
}

export default function RegisterOtpPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get('email') || '');
    }
  }, []);

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
        description: 'Your email has been verified.',
      });
      setIsVerified(true);
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
      {isVerified ? (
        <RegisterSuccessView />
      ) : (
        <OtpInputView
          email={email}
          otp={otp}
          setOtp={setOtp}
          handleVerify={handleVerify}
          handleResend={handleResend}
          loading={loading}
          canResend={canResend}
          resendCooldown={resendCooldown}
        />
      )}
    </div>
  );
}
