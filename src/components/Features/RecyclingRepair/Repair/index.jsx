import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Wrapper from '@/components/_shared/Wrapper';
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
import {
  UploadCloud,
  X,
  Loader2,
  ChevronRight,
  Home,
  Warehouse,
} from 'lucide-react';

const repairTypes = [
  { name: 'Minor', value: 'minor_repair' },
  { name: 'Moderate', value: 'moderate_repair' },
  { name: 'Major', value: 'major_repair' },
];

export default function PostRepairItem() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [repairType, setRepairType] = useState('');
  const [addressId, setAddressId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [repairLocation, setRepairLocation] = useState('my_location');
  const [frontViewImage, setFrontViewImage] = useState(null);
  const [damageImage, setDamageImage] = useState(null);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('cyclefy_user_token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'You must be logged in.',
        });
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };
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
          description: 'Could not fetch necessary form data.',
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleImageChange = (file, setImageState, errorField) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: `File ${file.name} is too large. Max 5 MB.`,
      });
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Invalid file type. Only JPEG/PNG are allowed.',
      });
      return;
    }
    setImageState(file);
    if (errors[errorField]) {
      setErrors((prev) => ({ ...prev, [errorField]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemName) newErrors.itemName = 'Item name is required.';
    if (!description) newErrors.description = 'Description is required.';
    if (!categoryId) newErrors.categoryId = 'Category is required.';
    if (!itemWeight) newErrors.itemWeight = 'Item weight is required.';
    if (!repairType) newErrors.repairType = 'Repair type is required.';
    if (!addressId) newErrors.addressId = 'Address is required.';
    if (!phoneId) newErrors.phoneId = 'Contact number is required.';
    if (!frontViewImage)
      newErrors.frontViewImage = 'Front view image is required.';
    if (!damageImage)
      newErrors.damageImage = 'Damage close-up image is required.';
    if (!agree) newErrors.agree = 'You must agree to the terms.';
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

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('item_name', itemName);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('item_weight', itemWeight);
    formData.append('repair_type', repairType);
    formData.append('address_id', addressId);
    formData.append('phone_id', phoneId);
    formData.append('repair_location', repairLocation);
    formData.append('front_view', frontViewImage);
    formData.append('close_up_damage', damageImage);

    const token = localStorage.getItem('cyclefy_user_token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/repairs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast({
        title: 'Success',
        description: 'Your repair request has been submitted.',
      });
      const repairId = response.data.data.id;
      router.push(
        `/features/recycling-repair/repair/payment/${repairId}/payment-detail`
      );
    } catch (error) {
      console.error('Failed to submit repair request:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center py-20 bg-gray-50'>
      <Wrapper>
        <div className='flex items-center gap-2 text-base font-medium'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/features/recycling-repair' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='text-text-primary' />
          <span className='text-gray-500'>Repair Your Item</span>
        </div>
        <div className='flex my-[10px] items-center gap-[10px]'>
          <div className='w-[60px] h-[60px] bg-gray-200 rounded-full' />
          <p className='text-[30px] font-bold'>Repair Your Item</p>
        </div>
        <p className='text-lg'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className='flex flex-col lg:flex-row gap-12 lg:gap-[70px] mt-[30px] justify-between'>
          <div className='flex flex-col max-w-lg gap-8'>
            <h2 className='text-[30px] font-bold'>How To Repair Your Item?</h2>

            {/* Step 1 */}
            <div className='flex gap-6'>
              <div className='flex items-center justify-center flex-shrink-0 w-16 h-16 text-4xl font-bold text-white rounded-full bg-primary'>
                1
              </div>
              <div>
                <h3 className='text-xl font-bold'>Prepare the Item</h3>
                <p className='mt-1 text-gray-600'>
                  Choose the item you want to repair. Make sure to clean it and
                  weigh it. Take clear photos of the item, including the damaged
                  part.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className='flex gap-6'>
              <div className='flex items-center justify-center flex-shrink-0 w-16 h-16 text-4xl font-bold text-white rounded-full bg-primary'>
                2
              </div>
              <div>
                <h3 className='text-xl font-bold'>Fill Out the Repair Form</h3>
                <p className='mt-1 text-gray-600'>
                  Enter the item name, a short description, category, and
                  estimated weight. Choose the type of repair, enter your
                  address and contact number, and select your preferred repair
                  location. Upload two images: a clear front view and a close-up
                  of the damaged part.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className='flex gap-6'>
              <div className='flex items-center justify-center flex-shrink-0 w-16 h-16 text-4xl font-bold text-white rounded-full bg-primary'>
                3
              </div>
              <div>
                <h3 className='text-xl font-bold'>Submit for Repair</h3>
                <p className='mt-1 text-gray-600'>
                  Click Repair This Item. After submitting, proceed with the
                  payment. Monitor your repair status in the Repair History
                  page.
                </p>
              </div>
            </div>
          </div>

          <div className='w-full max-w-lg p-8 space-y-6 bg-white shadow-lg rounded-2xl'>
            <form onSubmit={handleSubmit}>
              <div>
                <Label htmlFor='item-name'>Item Name</Label>
                <Input
                  id='item-name'
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.description}
                  </p>
                )}
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='category'>Item Category</Label>
                  <Select onValueChange={setCategoryId} value={categoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.categoryId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='item-weight'>Item Weight (kg)</Label>
                  <Input
                    id='item-weight'
                    type='number'
                    value={itemWeight}
                    onChange={(e) => setItemWeight(e.target.value)}
                  />
                  {errors.itemWeight && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.itemWeight}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor='repair-type'>Repair Type</Label>
                <Select onValueChange={setRepairType} value={repairType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select repair type' />
                  </SelectTrigger>
                  <SelectContent>
                    {repairTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.repairType && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.repairType}
                  </p>
                )}
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='address'>Address</Label>
                  <Select onValueChange={setAddressId} value={addressId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select address' />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.address_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.addressId && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.addressId}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor='contact'>Contact Number</Label>
                  <Select onValueChange={setPhoneId} value={phoneId}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select number' />
                    </SelectTrigger>
                    <SelectContent>
                      {phones.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.phoneId && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.phoneId}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label>Repair Location</Label>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <Button
                    type='button'
                    variant={
                      repairLocation === 'my_location' ? 'default' : 'outline'
                    }
                    onClick={() => setRepairLocation('my_location')}
                    className='flex items-center gap-2'
                  >
                    <Home className='w-4 h-4' /> My Location
                  </Button>
                  <Button
                    type='button'
                    variant={
                      repairLocation === 'warehouse' ? 'default' : 'outline'
                    }
                    onClick={() => setRepairLocation('warehouse')}
                    className='flex items-center gap-2'
                  >
                    <Warehouse className='w-4 h-4' /> Warehouse
                  </Button>
                </div>
              </div>
              <div>
                <Label>Upload Image</Label>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <div className='flex flex-col items-center p-4 border-2 border-dashed rounded-md'>
                    <Label
                      htmlFor='front-view'
                      className='text-sm text-center cursor-pointer'
                    >
                      <UploadCloud className='w-8 h-8 mx-auto text-gray-400' />{' '}
                      Front View
                      <input
                        id='front-view'
                        type='file'
                        className='sr-only'
                        accept='image/png, image/jpeg'
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files[0],
                            setFrontViewImage,
                            'frontViewImage'
                          )
                        }
                      />
                    </Label>
                    {frontViewImage && (
                      <p className='mt-2 text-xs text-center truncate'>
                        {frontViewImage.name}
                      </p>
                    )}
                    {errors.frontViewImage && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.frontViewImage}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col items-center p-4 border-2 border-dashed rounded-md'>
                    <Label
                      htmlFor='damage-view'
                      className='text-sm text-center cursor-pointer'
                    >
                      <UploadCloud className='w-8 h-8 mx-auto text-gray-400' />{' '}
                      Close-up of Damage
                      <input
                        id='damage-view'
                        type='file'
                        className='sr-only'
                        accept='image/png, image/jpeg'
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files[0],
                            setDamageImage,
                            'damageImage'
                          )
                        }
                      />
                    </Label>
                    {damageImage && (
                      <p className='mt-2 text-xs text-center truncate'>
                        {damageImage.name}
                      </p>
                    )}
                    {errors.damageImage && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.damageImage}
                      </p>
                    )}
                  </div>
                </div>
                <p className='mt-1 text-xs text-gray-500'>JPEG/PNG, max 5 MB</p>
              </div>
              <div className='pt-4 space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    checked={agree}
                    onCheckedChange={setAgree}
                  />
                  <Label htmlFor='terms' className='text-sm font-normal'>
                    I agree to the{' '}
                    <a href='#' className='underline'>
                      terms of service
                    </a>{' '}
                    and{' '}
                    <a href='#' className='underline'>
                      privacy policy
                    </a>
                    .
                  </Label>
                </div>
                {errors.agree && (
                  <p className='-mt-2 text-sm text-red-500'>{errors.agree}</p>
                )}
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    'Repair This Item'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
