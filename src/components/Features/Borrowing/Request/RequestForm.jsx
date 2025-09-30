import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
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

import { Loader2, CalendarIcon } from 'lucide-react';
import ConfirmRequestModal from './ConfirmRequestModal';
import SuccessRequestModal from './SuccessRequestModal';

export default function RequestBorrowForm() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);

  const [reason, setReason] = useState('');
  const [addressId, setAddressId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [durationFrom, setDurationFrom] = useState(undefined);
  const [durationTo, setDurationTo] = useState(undefined);
  const [agree, setAgree] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const fetchDataForDropdowns = async () => {
      setIsDataLoading(true);
      const token = localStorage.getItem('cyclefy_user_token');
      if (!token) {
        toast({ variant: 'destructive', title: 'Authentication Error' });
        setIsDataLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
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
        toast({ variant: 'destructive', title: 'Failed to load data' });
      } finally {
        setIsDataLoading(false);
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
    const payload = {
      reason,
      address_id: parseInt(addressId, 10),
      phone_id: parseInt(phoneId, 10),
      duration_from: format(durationFrom, 'yyyy-MM-dd'),
      duration_to: format(durationTo, 'yyyy-MM-dd'),
    };
    const endpoint = `${process.env.NEXT_PUBLIC_HOST}/borrows/${id}/request`;
    try {
      const token = localStorage.getItem('cyclefy_user_token');
      await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.response?.data?.message || 'An error occurred.',
      });
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className='flex items-center justify-center w-full max-w-lg p-6 bg-[#F8F9FA] rounded-lg h-96'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    );
  }

  return (
    <>
      <div className='w-full max-w-lg p-6 bg-[#F8F9FA] rounded-lg h-fit'>
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
            <Label>Duration</Label>
            <div className='grid grid-cols-1 gap-4 mt-1 sm:grid-cols-2'>
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
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Send Request
          </Button>
        </form>
      </div>
      <ConfirmRequestModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeSubmit}
        isLoading={isSubmitting}
      />
      <SuccessRequestModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}
