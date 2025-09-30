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

export default function SuccessModal({ isOpen, onClose, postType }) {
  const router = useRouter();
  const historyLink = `/user/histories/${postType}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='p-2 rounded-full w-fit bg-primary/20'>
            <CheckCircle2 className='w-10 h-10 text-primary' />
          </div>
          <DialogTitle className='mt-2 text-xl capitalize'>
            {postType} Form Submitted
          </DialogTitle>
          <DialogDescription>
            Your item has been successfully listed. You can track its status in
            your history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col-reverse gap-2 sm:flex-row sm:justify-center'>
          <Button variant='outline' onClick={() => router.push('/')}>
            Go Home
          </Button>
          <Button
            className='bg-primary hover:bg-primary/90'
            onClick={() => router.push(historyLink)}
          >
            View History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
