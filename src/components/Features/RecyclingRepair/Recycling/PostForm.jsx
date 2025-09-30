import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X, Loader2 } from 'lucide-react';

export default function PostRecyclingItemForm({ setFormData, setPage }) {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [images, setImages] = useState([]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      setIsDataLoading(true);
      const token = localStorage.getItem('cyclefy_user_token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
        });
        setIsDataLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [categoryRes, addressRes, phoneRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/categories`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/addresses`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/phones`, {
            headers,
          }),
        ]);
        setCategories(categoryRes.data.data || []);
        setAddresses(addressRes.data.data || []);
        setPhones(phoneRes.data.data || []);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load data',
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [router.isReady, toast]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let validationError = null;
    const newImages = [];
    files.forEach((file) => {
      if (images.length + newImages.length >= 5) {
        validationError = 'You can only upload a maximum of 5 images.';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        validationError = `File ${file.name} is too large. Max size is 5 MB.`;
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        validationError = `File ${file.name} has an invalid type. Only JPEG/PNG are allowed.`;
        return;
      }
      newImages.push(file);
    });

    if (validationError) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: validationError,
      });
    } else {
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemName) newErrors.itemName = 'Item name is required.';
    if (!description) newErrors.description = 'Description is required.';
    if (!categoryId) newErrors.categoryId = 'Please select a category.';
    if (!addressId) newErrors.addressId = 'Please select an address.';
    if (!phoneId) newErrors.phoneId = 'Please select a contact number.';
    if (images.length === 0)
      newErrors.images = 'At least one image is required.';
    if (!agree) newErrors.agree = 'You must agree to the terms of service.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('item_name', itemName);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('address_id', addressId);
    formData.append('phone_id', phoneId);
    images.forEach((image) => {
      formData.append('images', image);
    });
    setFormData(formData);
    setPage('find-location');
  };

  if (!router.isReady || isDataLoading) {
    return (
      <div className='flex items-center justify-center w-full max-w-lg p-6 bg-white rounded-lg shadow-md h-96'>
        <Loader2 className='w-6 h-6 animate-spin' />
        <span className='ml-2'>Loading form...</span>
      </div>
    );
  }

  return (
    <div className='w-full max-w-lg p-6 bg-white rounded-lg shadow-md h-fit'>
      <h1 className='mb-4 text-2xl font-bold'>Recycling Details</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='item-name'>Item Name</Label>
          <Input
            id='item-name'
            placeholder='e.g., Used Cardboard Box'
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          {errors.itemName && (
            <p className='mt-1 text-sm text-red-500'>{errors.itemName}</p>
          )}
        </div>
        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            placeholder='e.g., Thick cardboard from a TV box...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className='mt-1 text-sm text-red-500'>{errors.description}</p>
          )}
        </div>
        <div>
          <Label htmlFor='category'>Item Category</Label>
          <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger id='category'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className='mt-1 text-sm text-red-500'>{errors.categoryId}</p>
          )}
        </div>
        <div>
          <Label htmlFor='address'>Pickup Address</Label>
          <Select onValueChange={setAddressId} value={addressId}>
            <SelectTrigger id='address'>
              <SelectValue placeholder='Select your address' />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr) => (
                <SelectItem key={addr.id} value={String(addr.id)}>
                  {addr.address_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.addressId && (
            <p className='mt-1 text-sm text-red-500'>{errors.addressId}</p>
          )}
        </div>
        <div>
          <Label htmlFor='contact'>Contact Number</Label>
          <Select onValueChange={setPhoneId} value={phoneId}>
            <SelectTrigger id='contact'>
              <SelectValue placeholder='Select your contact number' />
            </SelectTrigger>
            <SelectContent>
              {phones.map((phone) => (
                <SelectItem key={phone.id} value={String(phone.id)}>
                  {phone.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.phoneId && (
            <p className='mt-1 text-sm text-red-500'>{errors.phoneId}</p>
          )}
        </div>
        <div>
          <Label htmlFor='upload-image'>Upload Image</Label>
          <div className='flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-dashed rounded-md'>
            <div className='space-y-1 text-center'>
              <UploadCloud className='w-12 h-12 mx-auto text-gray-400' />
              <div className='flex text-sm text-gray-600'>
                <label
                  htmlFor='file-upload'
                  className='relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none'
                >
                  <span>Add File</span>
                  <input
                    id='file-upload'
                    name='file-upload'
                    type='file'
                    className='sr-only'
                    multiple
                    onChange={handleImageChange}
                    accept='image/png, image/jpeg'
                  />
                </label>
              </div>
              <p className='text-xs text-gray-500'>JPEG/PNG. Max 5 MB</p>
            </div>
          </div>
          {errors.images && (
            <p className='mt-1 text-sm text-red-500'>{errors.images}</p>
          )}
        </div>
        {images.length > 0 && (
          <div className='space-y-2'>
            {images.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-2 bg-gray-100 rounded-md'
              >
                <p className='text-sm truncate'>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeImage(index)}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className='flex items-start space-x-3'>
          <Checkbox
            id='terms'
            checked={agree}
            onCheckedChange={setAgree}
            className='mt-1'
          />
          <Label
            htmlFor='terms'
            className='text-sm font-normal leading-relaxed'
          >
            I agree to the{' '}
            <a href='/terms' className='underline'>
              terms of service
            </a>{' '}
            and{' '}
            <a href='/privacy' className='underline'>
              privacy policy
            </a>{' '}
            of Cyclefy.
          </Label>
        </div>
        {errors.agree && (
          <p className='-mt-2 text-sm text-red-500'>{errors.agree}</p>
        )}
        <Button type='submit' className='w-full bg-primary hover:bg-primary/90'>
          Next: Find Location
        </Button>
      </form>
    </div>
  );
}
