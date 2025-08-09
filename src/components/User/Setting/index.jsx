import { useState } from 'react';

import Wrapper from '@/components/_shared/Wrapper';
import FullNameModal from './FullNameModal';
import UsernameModal from './UsernameModal';
import EmailModal from './EmailModal';
import PasswordModal from './PasswordModal';
import AddressModal from './AddressModal';
import ContactNumberModal from './ContactNumberModal';

import { Pencil } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';

export default function MyAccount() {
  const [profile, setProfile] = useState({
    fullName: 'Alif Ihsan',
    username: 'alifihsan',
    email: 'alifihsan@gmail.com',
    password: '••••••••',
    addresses: [
      'House (Jl. Telekomunikasi No.1, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40267)',
      'House 2 (Jl. Telekomunikasi No.1, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40267)',
    ],
    contactNumbers: ['+6281234567890', '+6281209876543'],
  });

  const [openModal, setOpenModal] = useState({});

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        <div className='flex gap-12'>
          {/* Left side - profile image */}
          <div className='flex flex-col items-center w-64 gap-3'>
            <div className='w-40 h-40 bg-[#252525] rounded-full'></div>
            <button className='px-4 py-2 text-sm text-white rounded bg-primary'>
              Select Image
            </button>
            <p className='text-xs text-gray-500'>JPEG/PNG, max 5 MB</p>
          </div>

          {/* Right side - profile settings */}
          <div className='flex-1'>
            <h2 className='mb-6 text-xl font-bold'>Profile Settings</h2>

            {/* Basic info */}
            {[
              { label: 'Full Name', key: 'fullName' },
              { label: 'Username', key: 'username' },
              { label: 'Email', key: 'email' },
              { label: 'Password', key: 'password' },
            ].map((field) => (
              <div className='flex items-center gap-6 mb-4' key={field.key}>
                <p className='w-32 text-base font-semibold text-black'>
                  {field.label}
                </p>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    disabled
                    value={profile[field?.key]}
                    className='w-full px-3 py-2 text-sm bg-gray-200 rounded pr-9'
                  />
                  <button
                    className='absolute -translate-y-1/2 top-1/2 right-2'
                    onClick={() =>
                      setOpenModal((prev) => ({ ...prev, [field.key]: true }))
                    }
                  >
                    <Pencil size={16} className='text-gray-500' />
                  </button>
                </div>
              </div>
            ))}

            {/* Addresses */}
            <div className='flex items-start gap-6 mb-4'>
              <p className='w-32 text-base font-semibold text-black'>Address</p>
              <div className='flex flex-col flex-1 gap-3'>
                {profile.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className='relative flex items-start max-w-full px-3 py-2 break-words bg-gray-200 rounded pr-9'
                  >
                    <span className='text-sm text-gray-800 break-words whitespace-normal'>
                      {addr}
                    </span>
                    <button
                      className='absolute -translate-y-1/2 top-1/2 right-2'
                      onClick={() =>
                        setOpenModal((prev) => ({
                          ...prev,
                          addressIndex: idx,
                        }))
                      }
                    >
                      <Pencil size={16} className='text-gray-500' />
                    </button>
                  </div>
                ))}

                <button
                  className='flex items-center gap-2 px-3 py-2 text-sm text-white rounded bg-primary w-fit'
                  onClick={() =>
                    setOpenModal((prev) => ({ ...prev, addressIndex: null }))
                  }
                >
                  <FaPlus />
                  Add New
                </button>
              </div>
            </div>

            {/* Contact Numbers */}
            <div className='flex items-start gap-6'>
              <p className='w-32 text-base font-semibold text-black'>
                Contact Number
              </p>
              <div className='flex flex-col flex-1 gap-3'>
                {profile.contactNumbers.map((num, idx) => (
                  <div className='relative' key={idx}>
                    <input
                      type='text'
                      disabled
                      value={num}
                      className='w-full px-3 py-2 text-sm bg-gray-200 rounded pr-9'
                    />
                    <button
                      className='absolute -translate-y-1/2 top-1/2 right-2'
                      onClick={() =>
                        setOpenModal((prev) => ({
                          ...prev,
                          contactIndex: idx,
                        }))
                      }
                    >
                      <Pencil size={16} className='text-gray-500' />
                    </button>
                  </div>
                ))}
                <button
                  className='flex items-center gap-2 px-3 py-2 text-sm text-white rounded bg-primary w-fit'
                  onClick={() =>
                    setOpenModal((prev) => ({ ...prev, contactIndex: null }))
                  }
                >
                  <FaPlus />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODALS */}
        <FullNameModal
          isOpen={openModal.fullName}
          initialValue={profile.fullName}
          onClose={() => setOpenModal((p) => ({ ...p, fullName: false }))}
          onSave={(val) => setProfile((p) => ({ ...p, fullName: val }))}
        />

        <UsernameModal
          isOpen={openModal.username}
          initialValue={profile.username}
          onClose={() => setOpenModal((p) => ({ ...p, username: false }))}
          onSave={(val) => setProfile((p) => ({ ...p, username: val }))}
        />

        <EmailModal
          isOpen={openModal.email}
          initialValue={profile.email}
          onClose={() => setOpenModal((p) => ({ ...p, email: false }))}
          onSave={(val) => setProfile((p) => ({ ...p, email: val }))}
        />

        <PasswordModal
          isOpen={openModal.password}
          onClose={() => setOpenModal((p) => ({ ...p, password: false }))}
          onSave={({ password }) =>
            setProfile((p) => ({ ...p, password: '•••••••••' }))
          }
        />

        <AddressModal
          isOpen={
            openModal.addressIndex !== undefined &&
            openModal.addressIndex !== false
          }
          initialValue={
            openModal.addressIndex !== null
              ? profile.addresses[openModal.addressIndex]
              : ''
          }
          onClose={() =>
            setOpenModal((p) => ({ ...p, addressIndex: undefined }))
          }
          onSave={(val) =>
            setProfile((p) => {
              if (openModal.addressIndex === null) {
                return { ...p, addresses: [...p.addresses, val] };
              } else {
                const updated = [...p.addresses];
                updated[openModal.addressIndex] = val;
                return { ...p, addresses: updated };
              }
            })
          }
        />

        <ContactNumberModal
          isOpen={
            openModal.contactIndex !== undefined &&
            openModal.contactIndex !== false
          }
          initialValue={
            openModal.contactIndex !== null
              ? profile.contactNumbers[openModal.contactIndex]
              : ''
          }
          onClose={() =>
            setOpenModal((p) => ({ ...p, contactIndex: undefined }))
          }
          onSave={(val) =>
            setProfile((p) => {
              if (openModal.contactIndex === null) {
                return { ...p, contactNumbers: [...p.contactNumbers, val] };
              } else {
                const updated = [...p.contactNumbers];
                updated[openModal.contactIndex] = val;
                return { ...p, contactNumbers: updated };
              }
            })
          }
        />
      </Wrapper>
    </div>
  );
}
