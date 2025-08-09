'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactNumberModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) {
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setContactNumber(initialValue || '');
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    onSave(contactNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-[#D9D9D9] w-[584px]'>
        <DialogHeader>
          <DialogTitle>Contact Number</DialogTitle>
          <DialogDescription>Lorem ipsum dolor sit amet</DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Contact Number</label>
          <Input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder='Enter your contact number'
          />
        </div>

        <DialogFooter className='flex justify-end gap-2 mt-4 text-white'>
          <Button
            className='w-full bg-status-error hover:bg-status-error'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className='w-full' onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
