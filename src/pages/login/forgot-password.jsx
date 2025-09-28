import { useState } from 'react';
import ForgotPasswordForm from '@/components/ForgotPassword/ForgotPasswordForm';
import VerifyResetOtp from '@/components/ForgotPassword/VerifyResetOtp';
import ResetPasswordForm from '@/components/ForgotPassword/ResetPasswordForm';
import ResetSuccess from '@/components/ForgotPassword/ResetSuccess';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ForgotPasswordForm setEmail={setEmail} setStep={setStep} />;
      case 2:
        return (
          <VerifyResetOtp email={email} setOtp={setOtp} setStep={setStep} />
        );
      case 3:
        return <ResetPasswordForm email={email} otp={otp} setStep={setStep} />;
      case 4:
        return <ResetSuccess />;
      default:
        return <ForgotPasswordForm setEmail={setEmail} setStep={setStep} />;
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-gray-100'>
      {renderStep()}
    </div>
  );
}
