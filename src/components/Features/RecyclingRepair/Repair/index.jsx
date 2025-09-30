import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
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
import {
  UploadCloud,
  Loader2,
  ChevronRight,
  Home,
  Warehouse,
} from 'lucide-react';
import Wrapper from '@/components/_shared/Wrapper';
import ConfirmRepairModal from './ConfirmRepairModel';
import SuccessModal from './SuccessModal';

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedRepairId, setSubmittedRepairId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('cyclefy_user_token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
        });
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
        description: `File is too large. Max 5 MB.`,
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
    setErrors((prev) => ({ ...prev, [errorField]: null }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmModalOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
    }
  };

  const executeSubmit = async () => {
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
      setSubmittedRepairId(response.data.data.id);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Step = ({ number, title, children }) => (
    <div className='flex gap-4'>
      <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full md:w-16 md:h-16 md:text-4xl bg-primary'>
        {number}
      </div>
      <div>
        <div className='text-lg font-bold md:text-xl'>{title}</div>
        <div className='mt-1 text-gray-600'>{children}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className='flex justify-center py-10 bg-gray-50 md:py-20'>
        <Wrapper>
          <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
            <Link href='/' className='text-text-primary'>
              Cyclefy
            </Link>
            <ChevronRight className='w-4 h-4 text-text-primary' />
            <Link
              href='/features/recycling-repair'
              className='text-text-primary'
            >
              Recycling & Repair
            </Link>
            <ChevronRight className='w-4 h-4 text-text-primary' />
            <span className='font-bold text-tertiary'>Repair Your Item</span>
          </div>
          <div className='flex items-center gap-4 my-6'>
            <div className='w-12 h-12 bg-no-repeat bg-cover rounded-full md:w-16 md:h-16 bg-recycle-repair-logo' />
            <h1 className='text-2xl font-bold md:text-3xl'>Repair Your Item</h1>
          </div>
          <p className='max-w-4xl text-base text-gray-600 md:text-lg'>
            Fix what’s broken instead of throwing it away. Submit your item for
            repair and extend its usability while reducing waste.
          </p>

          <div className='flex flex-col gap-12 mt-8 lg:flex-row lg:gap-16 md:mt-12'>
            <div className='flex flex-col flex-1 order-2 gap-8 lg:order-none'>
              <h2 className='text-2xl font-bold md:text-3xl'>
                How To Repair Your Item?
              </h2>
              <Step number='1' title='Prepare the Item'>
                Choose the item you want to repair. Make sure to clean it and
                weigh it. Take clear photos of the item, including the damaged
                part.
              </Step>
              <Step number='2' title='Fill Out the Repair Form'>
                <p className='mt-1 text-gray-600'>
                  Enter the item name (e.g., <b>Electric Kettle</b>), a short
                  description (e.g.,{' '}
                  <b>
                    Teko pemanas air elektrik, kapasitas 1.7L, baru dipakai
                    beberapa kali. Kemungkinan masalah terletak pada elemen
                    pemanas atau sensor otomatis. Saat digunakan, teko bisa
                    menyala tetapi tidak memanaskan air secara maksimal.
                  </b>
                  ), category, and estimated weight.Choose the type of repair
                  (e.g., Minor, Moderate, Major), enter your address and contact
                  number, and select your preferred repair location.Upload two
                  images: a clear front view and a close-up of the damaged part.
                </p>
              </Step>
              <Step number='3' title='Submit for Repair'>
                Click {'"'}Repair This Item{'"'} and confirm your submission.
                After submitting, proceed with the payment to finalize the
                request.
              </Step>
            </div>

            <div className='flex justify-center w-full lg:w-auto lg:justify-end'>
              <div className='w-full max-w-lg p-6 space-y-6 bg-white shadow-lg md:p-8 rounded-2xl'>
                <form onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor='item-name'>Item Name</Label>
                    <Input
                      id='item-name'
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                    {errors.itemName && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.itemName}
                      </p>
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
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                          repairLocation === 'my_location'
                            ? 'default'
                            : 'outline'
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
                    <div className='grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2'>
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
                    <p className='mt-1 text-xs text-gray-500'>
                      JPEG/PNG, max 5 MB
                    </p>
                  </div>
                  <div className='pt-4 space-y-4'>
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
                      <p className='-mt-2 text-sm text-red-500'>
                        {errors.agree}
                      </p>
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
          </div>
        </Wrapper>
      </div>
      <ConfirmRepairModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeSubmit}
        isLoading={isSubmitting}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        repairId={submittedRepairId}
      />
    </>
  );
}
