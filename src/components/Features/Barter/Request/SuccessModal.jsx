import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose }) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='p-2 rounded-full w-fit bg-primary/20'>
            <CheckCircle2 className='w-10 h-10 text-primary' />
          </div>
          <DialogTitle className='mt-2 text-xl'>
            Barter request successfully sent!
          </DialogTitle>
          <DialogDescription>
            Your request has been sent. You can track the status in your barter
            history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col-reverse gap-2 sm:flex-row sm:justify-center'>
          <Button variant='outline' onClick={() => router.push('/')}>
            Go Home
          </Button>
          <Button
            className='bg-primary hover:bg-primary/90'
            onClick={() => router.push('/user/histories/barter')}
          >
            View Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
