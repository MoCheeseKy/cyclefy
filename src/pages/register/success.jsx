// components/Auth/ResetSuccess.jsx

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function RegisterSuccess() {
  const router = useRouter();

  return (
    <div className='w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl'>
      <CheckCircle2 className='w-16 h-16 mx-auto text-green-500' />
      <h1 className='mt-4 text-2xl font-bold'>Email Verification Successful</h1>
      <p className='mt-2 text-gray-600'>
        Your email has been successfully verified. You can now proceed to sign
        in to your account.
      </p>
      <Button onClick={() => router.push('/login')} className='w-full mt-6'>
        Sign In
      </Button>
    </div>
  );
}
