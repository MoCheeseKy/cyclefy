import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

import Wrapper from '@/components/_shared/Wrapper';
import FullNameModal from './FullNameModal';
import UsernameModal from './UsernameModal';
import EmailModal from './EmailModal';
import PasswordModal from './PasswordModal';
import AddressModal from './AddressModal';
import ContactNumberModal from './ContactNumberModal';
import DeleteConfirmationModal from './DeleteConfirmation';

import { Pencil, Loader2, Trash } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';

export default function MyAccount() {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '••••••••',
    addresses: [],
    contactNumbers: [],
    profilePicture: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState({});

  const fetchProfile = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      const token = localStorage.getItem('cyclefy_user_token');
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/users/current`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data.data;
        setProfile({
          fullName: userData.fullname,
          username: userData.username,
          email: userData.email,
          password: '••••••••',
          addresses: userData.addresses || [],
          contactNumbers: userData.phones || [],
          profilePicture: userData.profile_picture,
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast({ variant: 'destructive', title: 'Failed to load profile' });
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (payload) => {
    const token = localStorage.getItem('cyclefy_user_token');
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_HOST}/users/current`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      await fetchProfile(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleSaveAddressOrContact = async (type, data) => {
    const token = localStorage.getItem('cyclefy_user_token');
    const itemToEdit = openModal[`edit${type}`];
    const isNew = !itemToEdit?.id;
    const endpoints = {
      Address: {
        C: '/users/current/addresses',
        U: `/users/current/addresses/${itemToEdit?.id}`,
      },
      Contact: {
        C: '/users/current/phones',
        U: `/users/current/phones/${itemToEdit?.id}`,
      },
    };
    const endpoint = isNew ? endpoints[type].C : endpoints[type].U;
    const method = isNew ? 'post' : 'patch';
    try {
      await axios[method](`${process.env.NEXT_PUBLIC_HOST}${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Success', description: `${type} has been saved.` });
      await fetchProfile(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save ${type.toLowerCase()}.`,
      });
    }
  };

  const handleDeleteAddressOrContact = async (type) => {
    const token = localStorage.getItem('cyclefy_user_token');
    const itemToDelete = openModal[`delete${type}`];
    if (!itemToDelete) return;
    const endpoints = {
      Address: `/users/current/addresses/${itemToDelete.id}`,
      Contact: `/users/current/phones/${itemToDelete.id}`,
    };
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_HOST}${endpoints[type]}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Success', description: `${type} has been deleted.` });
      await fetchProfile(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete ${type.toLowerCase()}.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex justify-center py-10 md:py-20'>
      <Wrapper>
        <div className='flex flex-col gap-12 md:flex-row'>
          <div className='flex flex-col items-center w-full gap-3 md:w-64'>
            <div
              className='w-40 h-40 bg-gray-300 bg-center bg-cover rounded-full'
              style={{
                backgroundImage: `url(${
                  profile.profilePicture || '/default-avatar.png'
                })`,
              }}
            ></div>
            <button className='px-4 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800'>
              Select Image
            </button>
            <p className='text-xs text-gray-500'>JPEG/PNG, max 5 MB</p>
          </div>

          <div className='flex-1'>
            <h2 className='mb-6 text-xl font-bold'>Profile Settings</h2>

            {[
              { label: 'Full Name', key: 'fullName' },
              { label: 'Username', key: 'username' },
              { label: 'Email', key: 'email' },
              { label: 'Password', key: 'password' },
            ].map((field) => (
              <div
                className='flex flex-col items-start gap-1 mb-4 md:flex-row md:items-center md:gap-6'
                key={field.key}
              >
                <p className='w-auto text-base font-semibold text-black md:w-32'>
                  {field.label}
                </p>
                <div className='relative flex-1 w-full'>
                  <input
                    type={field.key === 'password' ? 'password' : 'text'}
                    disabled
                    value={profile[field.key]}
                    className='w-full px-3 py-2 text-sm bg-gray-200 rounded pr-9'
                  />
                  <button
                    className='absolute -translate-y-1/2 top-1/2 right-2'
                    onClick={() => setOpenModal({ [field.key]: true })}
                  >
                    <Pencil size={16} className='text-gray-500' />
                  </button>
                </div>
              </div>
            ))}

            <div className='flex flex-col items-start gap-1 mb-4 md:flex-row md:gap-6'>
              <p className='w-auto text-base font-semibold text-black md:w-32'>
                Address
              </p>
              <div className='flex flex-col flex-1 w-full gap-3'>
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className='relative flex items-center p-2 pr-20 bg-gray-200 rounded'
                  >
                    <span className='flex-grow text-sm text-gray-800 break-words'>
                      <b>{addr.address_name}:</b> {addr.address}
                    </span>
                    <div className='absolute flex items-center -translate-y-1/2 top-1/2 right-2'>
                      <button
                        onClick={() => setOpenModal({ editAddress: addr })}
                        className='p-2 rounded-full hover:bg-gray-300'
                      >
                        <Pencil size={16} className='text-gray-600' />
                      </button>
                      <button
                        onClick={() => setOpenModal({ deleteAddress: addr })}
                        className='p-2 rounded-full hover:bg-gray-300'
                      >
                        <Trash size={16} className='text-red-500' />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className='flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 w-fit'
                  onClick={() => setOpenModal({ editAddress: {} })}
                >
                  <FaPlus /> Add New
                </button>
              </div>
            </div>

            <div className='flex flex-col items-start gap-1 md:flex-row md:gap-6'>
              <p className='w-auto text-base font-semibold text-black md:w-32'>
                Contact Number
              </p>
              <div className='flex flex-col flex-1 w-full gap-3'>
                {profile.contactNumbers.map((num) => (
                  <div
                    className='relative flex items-center p-2 pr-20 bg-gray-200 rounded'
                    key={num.id}
                  >
                    <span className='flex-grow text-sm text-gray-800'>
                      {num.number}
                    </span>
                    <div className='absolute flex items-center -translate-y-1/2 top-1/2 right-2'>
                      <button
                        onClick={() => setOpenModal({ editContact: num })}
                        className='p-2 rounded-full hover:bg-gray-300'
                      >
                        <Pencil size={16} className='text-gray-600' />
                      </button>
                      <button
                        onClick={() => setOpenModal({ deleteContact: num })}
                        className='p-2 rounded-full hover:bg-gray-300'
                      >
                        <Trash size={16} className='text-red-500' />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className='flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 w-fit'
                  onClick={() => setOpenModal({ editContact: {} })}
                >
                  <FaPlus /> Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        <FullNameModal
          isOpen={openModal.fullName}
          onClose={() => setOpenModal({})}
          onSave={(val) => handleSaveProfile({ fullname: val })}
          initialValue={profile.fullName}
        />
        <UsernameModal
          isOpen={openModal.username}
          onClose={() => setOpenModal({})}
          onSave={(val) => handleSaveProfile({ username: val })}
          initialValue={profile.username}
        />
        <EmailModal
          isOpen={openModal.email}
          onClose={() => setOpenModal({})}
          onSave={(val) => handleSaveProfile({ email: val })}
          initialValue={profile.email}
        />
        <PasswordModal
          isOpen={openModal.password}
          onClose={() => setOpenModal({})}
          onSave={(payload) => handleSaveProfile(payload)}
        />
        <AddressModal
          isOpen={!!openModal.editAddress}
          onClose={() => setOpenModal({})}
          onSave={(data) => handleSaveAddressOrContact('Address', data)}
          initialValue={openModal.editAddress}
        />
        <ContactNumberModal
          isOpen={!!openModal.editContact}
          onClose={() => setOpenModal({})}
          onSave={(data) => handleSaveAddressOrContact('Contact', data)}
          initialValue={openModal.editContact}
        />
        <DeleteConfirmationModal
          isOpen={!!openModal.deleteAddress}
          onClose={() => setOpenModal({})}
          onConfirm={() => {
            handleDeleteAddressOrContact('Address');
            setOpenModal({});
          }}
          title={`Delete "${openModal.deleteAddress?.address_name}"?`}
          description='This action cannot be undone. Are you sure you want to permanently delete this address?'
        />
        <DeleteConfirmationModal
          isOpen={!!openModal.deleteContact}
          onClose={() => setOpenModal({})}
          onConfirm={() => {
            handleDeleteAddressOrContact('Contact');
            setOpenModal({});
          }}
          title={`Delete "${openModal.deleteContact?.number}"?`}
          description='This action cannot be undone. Are you sure you want to permanently delete this number?'
        />
      </Wrapper>
    </div>
  );
}
