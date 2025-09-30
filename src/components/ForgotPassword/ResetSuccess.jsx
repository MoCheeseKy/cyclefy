// components/Auth/ResetSuccess.jsx

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ResetSuccess() {
  const handleSignIn = () => {
    window.location.href = '/login';
  };
  return (
    <div className='w-full max-w-md p-6 text-center bg-white shadow-lg sm:p-8 rounded-2xl'>
      <CheckCircle2 className='w-16 h-16 mx-auto text-green-500' />
      <h1 className='mt-4 text-xl font-bold md:text-2xl'>Reset Successful</h1>
      <p className='mt-2 text-sm text-gray-600 md:text-base'>
        Your password has been successfully reset. You can now sign in with your
        new password.
      </p>
      <Button
        onClick={handleSignIn}
        className='w-full mt-6 text-white bg-primary hover:bg-primary/90'
      >
        Sign In
      </Button>
    </div>
  );
}
