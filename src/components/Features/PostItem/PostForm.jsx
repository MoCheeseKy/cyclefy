import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';

// Import komponen dari Shadcn/UI
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Import ikon dari Lucide React
import { UploadCloud, X, Loader2, CalendarIcon } from 'lucide-react';

// Fungsi helper untuk mendapatkan judul dan teks tombol yang dinamis
const getPostTypeDetails = (type) => {
  switch (type) {
    case 'donate':
      return { title: 'Donate an Item', buttonText: 'Donate This Item' };
    case 'borrowing':
      return {
        title: 'List an Item for Borrowing',
        buttonText: 'List This Item',
      };
    case 'barter':
      return { title: 'List an Item for Barter', buttonText: 'List This Item' };
    default:
      return { title: 'Post an Item', buttonText: 'Post This Item' };
  }
};

export default function PostForm() {
  const router = useRouter();
  const { post_type } = router.query;
  const { toast } = useToast();

  // State untuk data dropdown
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);

  // State untuk input form
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [images, setImages] = useState([]);
  const [agree, setAgree] = useState(false);
  const [durationFrom, setDurationFrom] = useState(undefined);
  const [durationTo, setDurationTo] = useState(undefined);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Mengambil data untuk dropdown (kategori, alamat, telepon) saat komponen dimuat
  useEffect(() => {
    // Pastikan router sudah siap sebelum fetch data
    if (!router.isReady) return;

    const fetchData = async () => {
      const token = localStorage.getItem('cyclefy_user_token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'You must be logged in to post an item.',
        });
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

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
        console.error('Failed to fetch form data:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load data',
          description: 'Could not fetch categories, addresses, or phones.',
        });
      }
    };

    fetchData();
  }, [router.isReady, toast]); // Tambahkan router.isReady sebagai dependensi

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    let validationError = null;

    files.forEach((file) => {
      if (images.length + newImages.length >= 5) {
        validationError = 'You can only upload a maximum of 5 images.';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5 MB
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

  const resetForm = () => {
    setItemName('');
    setDescription('');
    setCategoryId('');
    setAddressId('');
    setPhoneId('');
    setImages([]);
    setAgree(false);
    setDurationFrom(undefined);
    setDurationTo(undefined);
    setErrors({});
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

    if (post_type === 'borrowing') {
      if (!durationFrom) newErrors.durationFrom = 'Start date is required.';
      if (!durationTo) newErrors.durationTo = 'End date is required.';
      if (durationFrom && durationTo && durationTo < durationFrom) {
        newErrors.durationTo = 'End date cannot be before start date.';
      }
    }

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

    setIsLoading(true);

    const formData = new FormData();
    formData.append('item_name', itemName);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('address_id', addressId);
    formData.append('phone_id', phoneId);
    images.forEach((image) => {
      formData.append('images', image);
    });

    if (post_type === 'borrowing') {
      if (durationFrom)
        formData.append('duration_from', format(durationFrom, 'yyyy-MM-dd'));
      if (durationTo)
        formData.append('duration_to', format(durationTo, 'yyyy-MM-dd'));
    }

    const apiEndpoints = {
      donate: `${process.env.NEXT_PUBLIC_HOST}/donations`,
      borrowing: `${process.env.NEXT_PUBLIC_HOST}/borrows`,
      barter: `${process.env.NEXT_PUBLIC_HOST}/barters`,
    };

    const endpoint = apiEndpoints[post_type];
    if (!endpoint) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid post type.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('cyclefy_user_token');
      await axios.post(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success!',
        description: 'Your item has been posted successfully.',
      });
      resetForm();
    } catch (error) {
      console.error('Submission failed:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!router.isReady) {
    return (
      <div className='flex items-center justify-center w-full max-w-[530px] h-fit bg-white rounded-[16px] p-6 shadow-md'>
        <Loader2 className='w-6 h-6 animate-spin' />
        <span className='ml-2'>Loading form...</span>
      </div>
    );
  }

  const { title, buttonText } = getPostTypeDetails(post_type);

  return (
    <div className='w-full max-w-[530px] h-fit bg-white rounded-[16px] p-6 shadow-md'>
      <h1 className='mb-4 text-2xl font-bold'>{title}</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='item-name'>Item Name</Label>
          <Input
            id='item-name'
            placeholder='Enter item name...'
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
            placeholder='Enter description...'
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
          <Label htmlFor='address'>Address</Label>
          <Select onValueChange={setAddressId} value={addressId}>
            <SelectTrigger id='address'>
              <SelectValue placeholder='Select/add your address' />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((addr) => (
                <SelectItem key={addr.id} value={String(addr.id)}>
                  {addr.address_name} - {addr.address}
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
              <SelectValue placeholder='Select/add your contact number' />
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

        {post_type === 'borrowing' && (
          <div>
            <Label>Duration</Label>
            <div className='grid grid-cols-2 gap-4 mt-1'>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={`w-full justify-start text-left font-normal ${
                        !durationFrom && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className='w-4 h-4 mr-2' />
                      {durationFrom ? (
                        format(durationFrom, 'dd/MM/yyyy')
                      ) : (
                        <span>From</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={durationFrom}
                      onSelect={setDurationFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.durationFrom && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.durationFrom}
                  </p>
                )}
              </div>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={`w-full justify-start text-left font-normal ${
                        !durationTo && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className='w-4 h-4 mr-2' />
                      {durationTo ? (
                        format(durationTo, 'dd/MM/yyyy')
                      ) : (
                        <span>To</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={durationTo}
                      onSelect={setDurationTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.durationTo && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.durationTo}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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

        <div className='flex items-center space-x-2'>
          <Checkbox id='terms' checked={agree} onCheckedChange={setAgree} />
          <Label htmlFor='terms' className='text-sm font-normal'>
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

        <Button
          type='submit'
          className='w-full bg-green-800 hover:bg-green-900'
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : null}
          {isLoading ? 'Submitting...' : buttonText}
        </Button>
      </form>
    </div>
  );
}
