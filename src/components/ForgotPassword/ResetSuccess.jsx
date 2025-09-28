// components/Auth/ResetSuccess.jsx

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ResetSuccess() {
  const router = useRouter();

  return (
    <div className='w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl'>
      <CheckCircle2 className='w-16 h-16 mx-auto text-green-500' />
      <h1 className='mt-4 text-2xl font-bold'>Reset Successful</h1>
      <p className='mt-2 text-gray-600'>
        Your password has been successfully reset. You can now sign in with your
        new password.
      </p>
      <Button onClick={() => router.push('/login')} className='w-full mt-6'>
        Sign In
      </Button>
    </div>
  );
}
