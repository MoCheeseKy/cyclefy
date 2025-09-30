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

export default function FormSuccessModal({ isOpen, onClose, onFindLocation }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='p-2 rounded-full w-fit bg-primary/20'>
            <CheckCircle2 className='w-10 h-10 text-primary' />
          </div>
          <DialogTitle className='mt-2 text-xl'>
            Recycling Form Submitted!
          </DialogTitle>
          <DialogDescription>
            Your item details have been saved. Now, find a suitable location to
            send your item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button
            className='w-full bg-primary hover:bg-primary/90'
            onClick={onFindLocation}
          >
            Find Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
