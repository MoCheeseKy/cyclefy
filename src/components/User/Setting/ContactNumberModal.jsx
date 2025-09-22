import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function ContactNumberModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) {
  const [number, setNumber] = useState('');

  useEffect(() => {
    // Mengisi input dengan data yang ada saat mode edit
    if (initialValue) {
      setNumber(initialValue.number || '');
    } else {
      // Mengosongkan input saat mode tambah baru
      setNumber('');
    }
  }, [initialValue]);

  const handleSave = () => {
    // Mengirim data dalam format objek kembali ke parent
    onSave({ number });
    onClose(); // Tutup modal setelah menyimpan
  };

  // Jangan render apa-apa jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {initialValue?.id
              ? 'Edit Contact Number'
              : 'Add New Contact Number'}
          </DialogTitle>
          <DialogDescription>
            Enter your phone number to help others reach you.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4 space-y-4'>
          <div>
            <Label htmlFor='contact-number' className='text-right'>
              Number
            </Label>
            <Input
              id='contact-number'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className='col-span-3'
              placeholder='+6281234567890'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
