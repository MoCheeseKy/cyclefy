import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full'>
            <Trash2 className='w-6 h-6 text-red-600' aria-hidden='true' />
          </div>
          <AlertDialogTitle className='mt-4 text-center'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='sm:justify-center'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700'
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
