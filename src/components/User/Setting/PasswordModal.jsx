'use client';

import { useState } from 'react';
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

export default function PasswordModal({ isOpen, onClose, onSave }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    onSave({ oldPassword, password, confirmPassword });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-[#D9D9D9] w-[584px]'>
        <DialogHeader>
          <DialogTitle className={'text-center w-full'}>Password</DialogTitle>
          <DialogDescription className={'text-center w-full'}>
            Lorem ipsum dolor sit amet
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Old Password</label>
          <Input
            type='password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder='Enter your password'
          />

          <label className='text-sm font-medium'>Password</label>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter new password'
          />

          <label className='text-sm font-medium'>Confirm Password</label>
          <Input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Re-enter new password'
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
