import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';

// Import komponen dari Shadcn/UI
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Mengganti Input dengan Textarea untuk 'reason'
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
import { Loader2, CalendarIcon } from 'lucide-react';

export default function RequestBorrowForm() {
  const router = useRouter();
  const { id } = router.query; // ID item yang ingin dipinjam
  const { toast } = useToast();

  // State untuk data dropdown
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);

  // State untuk input form
  const [reason, setReason] = useState('');
  const [addressId, setAddressId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [durationFrom, setDurationFrom] = useState(undefined);
  const [durationTo, setDurationTo] = useState(undefined);
  const [agree, setAgree] = useState(false);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch data untuk dropdown alamat dan telepon
  useEffect(() => {
    if (!router.isReady) return;
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchDataForDropdowns = async () => {
      try {
        const [addressRes, phoneRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/addresses`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_HOST}/users/current/phones`, {
            headers,
          }),
        ]);
        setAddresses(addressRes.data.data || []);
        setPhones(phoneRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
        toast({ variant: 'destructive', title: 'Failed to load data' });
      }
    };

    fetchDataForDropdowns();
  }, [router.isReady, toast]);

  const validateForm = () => {
    const newErrors = {};
    if (!reason) newErrors.reason = 'Reason for borrowing is required.';
    if (!addressId) newErrors.addressId = 'Please select an address.';
    if (!phoneId) newErrors.phoneId = 'Please select a contact number.';
    if (!durationFrom) newErrors.durationFrom = 'Start date is required.';
    if (!durationTo) newErrors.durationTo = 'End date is required.';
    if (durationFrom && durationTo && durationTo < durationFrom) {
      newErrors.durationTo = 'End date cannot be before start date.';
    }
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

    setIsLoading(true);

    // Siapkan payload sesuai format JSON yang diminta
    const payload = {
      reason,
      address_id: parseInt(addressId, 10), // Pastikan tipe data number
      phone_id: parseInt(phoneId, 10), // Pastikan tipe data number
      duration_from: format(durationFrom, 'yyyy-MM-dd'),
      duration_to: format(durationTo, 'yyyy-MM-dd'),
    };

    const endpoint = `${process.env.NEXT_PUBLIC_HOST}/borrows/${id}/request`;

    try {
      const token = localStorage.getItem('cyclefy_user_token');
      await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Kirim sebagai JSON, bukan FormData
        },
      });

      toast({
        title: 'Success!',
        description: 'Your borrow request has been sent.',
      });
      router.push(`/features/borrowing/detail/${id}`); // Redirect kembali ke halaman detail
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
      <div className='flex justify-center p-6'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='w-full max-w-lg p-6 bg-[#F8F9FA] rounded-lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='reason'>Reason for Borrowing</Label>
          <Textarea
            id='reason'
            placeholder='Enter reason...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {errors.reason && (
            <p className='mt-1 text-sm text-red-500'>{errors.reason}</p>
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
                <p className='mt-1 text-sm text-red-500'>{errors.durationTo}</p>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center pt-2 space-x-2'>
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
          {isLoading ? (
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          ) : (
            'Send Request'
          )}
        </Button>
      </form>
    </div>
  );
}
