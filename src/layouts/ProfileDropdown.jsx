// components/_shared/ProfileDropdown.js
import React from 'react';
import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover'; // Asumsi menggunakan Radix UI Popover
import { FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Ikon dari react-icons
import { HiOutlineLogout } from 'react-icons/hi'; // Contoh ikon logout

export default function ProfileDropdown({ profile, onLogoutClick }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className='flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
          <FaUserCircle className='w-5 h-5' />
          <span className='font-medium'>Welcome, {profile.username}!</span>
          {isOpen ? (
            <FaChevronUp className='w-4 h-4' />
          ) : (
            <FaChevronDown className='w-4 h-4' />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className='min-w-[180px] bg-white rounded-lg p-3 shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-2'
          align='end'
          sideOffset={8}
        >
          <div className='flex flex-col'>
            <Link
              href='/user/setting'
              className='flex items-center gap-2 px-3 py-2 text-gray-800 transition-colors rounded-md hover:bg-gray-100'
            >
              <FaUserCircle className='w-5 h-5 text-green-700' /> My Account
            </Link>
            <div className='my-1 border-t border-gray-200' />
            <button
              onClick={onLogoutClick}
              className='flex items-center gap-2 px-3 py-2 text-red-600 transition-colors rounded-md hover:bg-red-50 focus:outline-none'
            >
              <HiOutlineLogout className='w-5 h-5' /> Logout
            </button>
          </div>
          <Popover.Arrow className='fill-white' />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
