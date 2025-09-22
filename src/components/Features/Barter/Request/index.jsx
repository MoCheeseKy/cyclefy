import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import Wrapper from '@/components/_shared/Wrapper';
import NewItemForm from './NewItemForm';
import ExistingItemsForm from './ExistingItemForm';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Loader2, FileImage, LibraryBig } from 'lucide-react';

export default function RequestBarterPage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  // State yang dikontrol oleh halaman ini
  const [barterOption, setBarterOption] = useState('new');
  const [userItems, setUserItems] = useState([]);
  const [selectedExistingItemId, setSelectedExistingItemId] = useState(null);
  const [newItemData, setNewItemData] = useState({
    itemName: '',
    description: '',
    categoryId: '',
    images: [],
    addressId: '',
    phoneId: '',
  });
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch data yang dibutuhkan untuk form 'existing items'
  useEffect(() => {
    if (!router.isReady) return;
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) return;

    const fetchUserItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/users/current/barters`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        // --- PERBAIKAN DI SINI ---
        // Akses path yang benar: response.data.data.my_items
        const resultData = response.data.data.my_items;
        if (Array.isArray(resultData)) {
          setUserItems(resultData);
        } else {
          setUserItems([]);
        }
        // --- AKHIR PERBAIKAN ---
      } catch (error) {
        console.error('Failed to fetch user items:', error);
        setUserItems([]);
      }
    };
    fetchUserItems();
  }, [router.isReady]);

  const validate = () => {
    const newErrors = {};
    if (barterOption === 'new') {
      if (!newItemData.itemName) newErrors.itemName = 'Item name is required.';
      if (!newItemData.description)
        newErrors.description = 'Description is required.';
      if (!newItemData.categoryId)
        newErrors.categoryId = 'Category is required.';
      if (newItemData.images.length === 0)
        newErrors.images = 'At least one image is required.';
      if (!newItemData.addressId) newErrors.addressId = 'Address is required.';
      if (!newItemData.phoneId)
        newErrors.phoneId = 'Contact number is required.';
    } else {
      if (!selectedExistingItemId)
        newErrors.selectedItem = 'You must select an item.';
    }
    if (!agree) newErrors.agree = 'You must agree to the terms.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Please fix the errors in the form.',
      });
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    if (barterOption === 'new') {
      formData.append('item_name', newItemData.itemName);
      formData.append('description', newItemData.description);
      formData.append('category_id', newItemData.categoryId);
      formData.append('address_id', newItemData.addressId);
      formData.append('phone_id', newItemData.phoneId);
      newItemData.images.forEach((img) => formData.append('images', img));
    } else {
      formData.append('use_existing_barter_id', selectedExistingItemId);
    }

    try {
      const token = localStorage.getItem('cyclefy_user_token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/barters/${id}/request`,
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success!',
        description: 'Your barter request has been sent.',
      });
      router.push(`/features/barter/detail/${id}`);
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error.response?.data?.message || 'An error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!router.isReady) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  const Step = ({ number, title, children }) => (
    <div>
      <div className='flex items-center gap-4 mb-2'>
        <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-3xl font-bold text-white bg-green-700 rounded-full'>
          {number}
        </div>
        <div className='text-xl font-bold'>{title}</div>
      </div>
      <div className='pl-[64px] text-base text-gray-600'>{children}</div>
    </div>
  );

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        {/* Breadcrumbs & Header */}
        <div className='flex flex-wrap items-center gap-2 text-base font-medium'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/features/barter' className='text-text-primary'>
            Barter
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/features/discover/barter' className='text-text-primary'>
            Search for Items to Barter
          </Link>
          <ChevronRight className='text-secondary' />
          <span className='text-secondary'>Request to Barter</span>
        </div>
        <div className='flex items-center gap-4 my-4'>
          <div className='w-16 h-16 bg-gray-200 rounded-full' />
          <h1 className='text-3xl font-bold'>Request to Barter</h1>
        </div>
        <p className='max-w-4xl text-lg text-gray-600'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 gap-16 mt-8 lg:grid-cols-2'
        >
          {/* Kolom Kiri: Instruksi */}
          <div className='flex flex-col gap-6'>
            <h2 className='text-3xl font-bold'>How To Request a Barter?</h2>
            <Step number='1' title='Prepare Your Item'>
              Clean it, make sure it’s still functional, and ready to be
              swapped.
            </Step>
            <Step number='2' title='Offer Your Item'>
              In the Request to Barter form, choose how to offer your item:
              <ul className='mt-2 ml-4 space-y-1 list-disc'>
                <li>
                  <b>To post a new form:</b> Manually enter item details.
                </li>
                <li>
                  <b>Use existing item:</b> Select from items you{"'"}ve
                  previously posted.
                </li>
              </ul>
            </Step>
            <Step number='3' title='Submit & Confirm'>
              Tap Send Request. The item owner will be notified. If they{"'"}re
              interested in your offer, you{"'"}ll be contacted to arrange the
              exchange.
            </Step>
          </div>

          {/* Kolom Kanan: Form */}
          <div className='w-full space-y-6'>
            <div>
              <Label className='text-base font-semibold'>
                Select Barter Option
              </Label>
              <RadioGroup
                value={barterOption}
                onValueChange={setBarterOption}
                className='grid grid-cols-2 gap-4 mt-2'
              >
                <Label
                  htmlFor='new'
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                    barterOption === 'new'
                      ? 'border-green-600 ring-2 ring-green-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem value='new' id='new' className='sr-only' />
                  <FileImage className='w-6 h-6 mb-2' />
                  <span className='text-sm text-center'>
                    Fill out form for new item
                  </span>
                </Label>
                <Label
                  htmlFor='existing'
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${
                    barterOption === 'existing'
                      ? 'border-green-600 ring-2 ring-green-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem
                    value='existing'
                    id='existing'
                    className='sr-only'
                  />
                  <LibraryBig className='w-6 h-6 mb-2' />
                  <span className='text-sm text-center'>
                    Use existing items
                  </span>
                </Label>
              </RadioGroup>
            </div>

            {barterOption === 'new' ? (
              <NewItemForm
                formData={newItemData}
                setFormData={setNewItemData}
                errors={errors}
              />
            ) : (
              <ExistingItemsForm
                items={userItems}
                selectedItemId={selectedExistingItemId}
                onSelectionChange={setSelectedExistingItemId}
              />
            )}

            <div className='flex items-center space-x-2'>
              <Checkbox id='terms' checked={agree} onCheckedChange={setAgree} />
              <Label htmlFor='terms' className='text-sm font-normal'>
                I agree to the terms of service and privacy policy.
              </Label>
            </div>
            {errors.agree && (
              <p className='-mt-2 text-sm text-red-500'>{errors.agree}</p>
            )}

            <Button
              type='submit'
              className='w-full bg-green-800 hover:bg-green-900'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
}
