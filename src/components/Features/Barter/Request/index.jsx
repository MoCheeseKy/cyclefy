import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import Wrapper from '@/components/_shared/Wrapper';
import NewItemForm from './NewItemForm';
import ExistingItemsForm from './ExistingItemForm';
import ConfirmNewItemModal from './ConfirmNewItemModal';
import ConfirmExistingItemModal from './ConfirmExistingItemModal';
import SuccessModal from './SuccessModal';

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

  // State untuk modal
  const [isConfirmNewOpen, setIsConfirmNewOpen] = useState(false);
  const [isConfirmExistingOpen, setIsConfirmExistingOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) return;

    const fetchUserItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/users/current/barters`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resultData = response.data.data.my_items;
        setUserItems(Array.isArray(resultData) ? resultData : []);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (barterOption === 'new') {
        setIsConfirmNewOpen(true);
      } else {
        setIsConfirmExistingOpen(true);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Please fix the errors in the form.',
      });
    }
  };

  const executeSubmit = async () => {
    setIsLoading(true);
    setIsConfirmNewOpen(false);
    setIsConfirmExistingOpen(false);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSuccessOpen(true);
    } catch (error) {
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
        <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full md:text-3xl bg-primary'>
          {number}
        </div>
        <div className='text-lg font-bold md:text-xl'>{title}</div>
      </div>
      <div className='pl-16 text-base text-gray-600'>{children}</div>
    </div>
  );

  const selectedItemName =
    userItems.find((item) => item.id === selectedExistingItemId)?.item_name ||
    '';

  return (
    <>
      <div className='flex justify-center py-10 md:py-20'>
        <Wrapper>
          <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
            <Link href='/' className='text-text-primary'>
              Cyclefy
            </Link>
            <ChevronRight className='w-4 h-4 text-text-primary' />
            <Link href='/features/barter' className='text-text-primary'>
              Barter
            </Link>
            <ChevronRight className='w-4 h-4 text-text-primary' />
            <Link
              href='/features/discover/barter'
              className='text-text-primary'
            >
              Search for Items
            </Link>
            <ChevronRight className='w-4 h-4 text-text-primary' />
            <span className='font-bold text-tertiary'>Request to Barter</span>
          </div>
          <div className='flex items-center gap-4 my-6'>
            <div className='w-12 h-12 bg-center bg-cover rounded-full md:w-16 md:h-16 bg-barter-logo' />
            <h1 className='text-2xl font-bold md:text-3xl'>
              Request to Barter
            </h1>
          </div>
          <p className='max-w-4xl text-base text-gray-600 md:text-lg'>
            Offer one of your items in exchange for the item you want. You can
            post a new item or choose from items you{"'"}ve listed before.
          </p>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 gap-12 mt-8 lg:grid-cols-2 lg:gap-16'
          >
            <div className='flex flex-col order-2 gap-6 lg:order-1'>
              <h2 className='text-2xl font-bold md:text-3xl'>
                How To Request a Barter?
              </h2>
              <Step number='1' title='Prepare Your Item'>
                Clean it, make sure it’s still functional, and ready to be
                swapped.
              </Step>
              <Step number='2' title='Offer Your Item'>
                In the Request to Barter form, choose how to offer your item:
                <ul className='mt-2 ml-4 space-y-1 list-disc'>
                  <li>
                    Fill out a new form: Manually enter item detailsEnter your
                    item name (e.g., <b>Electric Kettle</b>), a clear
                    description (e.g.,
                    <b>
                      Teko pemanas air elektrik, kapasitas 1.7L, baru dipakai
                      beberapa kali
                    </b>
                    .), choose a category, location, and contact info. Don’t
                    forget to upload photos.
                  </li>
                  <li>
                    <b>Use existing item:</b> Select from items you{"'"}ve
                    previously posted.
                  </li>
                </ul>
              </Step>
              <Step number='3' title='Submit & Confirm'>
                Tap Send Request. The item owner will be notified. If they’re
                interested in your offer, you’ll be contacted to arrange the
                exchange. Track all your barter activity in the Barter History.
              </Step>
            </div>
            <div className='order-1 w-full space-y-6 lg:order-2'>
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
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      barterOption === 'new'
                        ? 'border-primary ring-2 ring-primary/30'
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
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                      barterOption === 'existing'
                        ? 'border-primary ring-2 ring-primary/30'
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
                  error={errors.selectedItem}
                />
              )}

              <div className='flex items-start space-x-3'>
                <Checkbox
                  id='terms'
                  checked={agree}
                  onCheckedChange={setAgree}
                  className='mt-1'
                />
                <div
                  htmlFor='terms'
                  className='text-sm font-normal leading-relaxed'
                >
                  I agree to the{' '}
                  <a href='/terms' className='underline'>
                    terms of service
                  </a>{' '}
                  and{' '}
                  <a href='/privacy-police' className='underline'>
                    privacy policy
                  </a>
                  .
                </div>
              </div>
              {errors.agree && (
                <p className='-mt-2 text-sm text-red-500'>{errors.agree}</p>
              )}

              <Button
                type='submit'
                className='w-full bg-primary hover:bg-primary/90'
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
      <ConfirmNewItemModal
        isOpen={isConfirmNewOpen}
        onClose={() => setIsConfirmNewOpen(false)}
        onConfirm={executeSubmit}
        isLoading={isLoading}
      />
      <ConfirmExistingItemModal
        isOpen={isConfirmExistingOpen}
        onClose={() => setIsConfirmExistingOpen(false)}
        onConfirm={executeSubmit}
        isLoading={isLoading}
        itemName={selectedItemName}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </>
  );
}
