import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, HelpCircle } from 'lucide-react';

export default function ConfirmLocationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  locationName,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <div className='p-2 rounded-full w-fit bg-primary/20'>
            <HelpCircle className='w-10 h-10 text-primary' />
          </div>
          <DialogTitle className='mt-2 text-xl'>Location Selected!</DialogTitle>
          <DialogDescription>
            You have selected {locationName || 'this location'}. Please confirm
            your choice or change the location.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-col-reverse gap-2 sm:flex-row sm:justify-center'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            className='bg-primary hover:bg-primary/90'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
