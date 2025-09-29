import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogOut } from 'lucide-react';

export default function LogoutConfirmModal({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 z-[99] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Content className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-xl p-8 shadow-lg z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'>
          <div className='flex flex-col items-center justify-center text-center'>
            {/* Logo atau ikon "C" besar seperti di Image 2 */}
            <LogOut size={224} className='mb-4 text-status-error' />
            {/* Ganti dengan logo Anda jika ada */}
            <Dialog.Title className='mb-2 text-2xl font-bold text-gray-900'>
              Come back soon!
            </Dialog.Title>
            <Dialog.Description className='mb-6 text-sm text-gray-600'>
              Are you sure you want to log out? Please confirm your choice.
            </Dialog.Description>
            <div className='flex w-full gap-3'>
              <button
                onClick={() => onOpenChange(false)}
                className='flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className='flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-status-error hover:bg-red-700'
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
