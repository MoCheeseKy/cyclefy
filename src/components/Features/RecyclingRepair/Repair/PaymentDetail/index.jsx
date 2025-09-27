import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  ChevronRight,
  Home,
  Warehouse,
  Wallet,
  QrCode,
} from 'lucide-react';

const paymentMethods = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: Home },
  { id: 'ewallet', name: 'E-Wallet', icon: Wallet },
  { id: 'qris', name: 'QRIS', icon: QrCode },
];
const banks = [
  { code: 'bni', name: 'BNI' },
  { code: 'bca', name: 'BCA' },
  { code: 'bri', name: 'BRI' },
  { code: 'cimb', name: 'CIMB' },
];

export default function RepairPaymentDetail() {
  const router = useRouter();
  const { toast } = useToast();
  const { id: repairId } = router.query;

  const [repairData, setRepairData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('bank_transfer');
  const [selectedBank, setSelectedBank] = useState('bni');

  const fetchRepairDetails = useCallback(async () => {
    if (!repairId) return;
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/repairs/${repairId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRepairData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch repair details:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch repair details.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [repairId, toast]);

  useEffect(() => {
    if (router.isReady) {
      fetchRepairDetails();
    }
  }, [router.isReady, fetchRepairDetails]);

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    const token = localStorage.getItem('cyclefy_user_token');
    let requestBody = { paymentType: selectedPaymentMethod };

    if (selectedPaymentMethod === 'bank_transfer') {
      requestBody.bankCode = selectedBank;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/repairs/${repairId}/pay`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success',
        description: 'Payment request created. Please complete the payment.',
      });
      router.push(`/features/recycling-repair/repair/payment/${repairId}/pay`);
    } catch (error) {
      console.error('Payment request failed:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading || !repairData) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  // PERBAIKAN: Ganti nama `address_id` menjadi `address` dan `phone_id` menjadi `phone` saat destructuring
  const {
    payment,
    item_name,
    description,
    category,
    repair_type,
    item_weight,
    repair_location,
    images,
    address_id: address,
    phone_id: phone,
  } = repairData;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className='flex justify-center py-20 bg-gray-100'>
      <Wrapper>
        <h1 className='mb-2 text-3xl font-bold'>Payment</h1>
        <p className='mb-8 text-gray-600'>
          Please review your repair details, choose your preferred payment
          method, and complete your transaction securely.
        </p>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='p-6 bg-white rounded-lg shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold'>My Address</h2>
              <div className='flex items-start justify-between'>
                <div>
                  {/* PERBAIKAN: Gunakan `phone.number` langsung, tambahkan optional chaining (?) untuk keamanan */}
                  <p className='font-bold'>
                    {payment?.user?.fullname} ({phone?.number})
                  </p>
                  <p className='mt-1 text-sm text-gray-500'>
                    {address?.address}
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Change
                </Button>
              </div>
            </div>

            <div className='p-6 bg-white rounded-lg shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold'>Your Repair</h2>
              <div className='flex gap-4'>
                <Image
                  src={images[0]}
                  alt={item_name}
                  width={100}
                  height={100}
                  className='object-cover w-24 h-24 rounded-md'
                />
                <div className='flex-1'>
                  <div className='flex items-start justify-between'>
                    <h3 className='text-lg font-bold'>{item_name}</h3>
                    <span className='px-3 py-1 text-xs text-green-800 bg-green-100 rounded-full'>
                      {category.name}
                    </span>
                  </div>
                  <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                    {description}
                  </p>
                  <div className='flex gap-4 mt-2 text-xs text-gray-600'>
                    <span>
                      Type:{' '}
                      <span className='font-semibold capitalize'>
                        {repair_type.replace('_', ' ')}
                      </span>
                    </span>
                    <span>
                      Weight:{' '}
                      <span className='font-semibold'>{item_weight} kg</span>
                    </span>
                    <span>
                      Location:{' '}
                      <span className='font-semibold capitalize'>
                        {repair_location.replace('_', ' ')}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='p-6 bg-white rounded-lg shadow-sm'>
              <h2 className='mb-4 text-xl font-semibold'>Payment Method</h2>
              <div className='grid grid-cols-3 gap-4'>
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={
                      selectedPaymentMethod === method.id
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className='flex flex-col h-20 gap-2'
                  >
                    <method.icon className='w-6 h-6' />{' '}
                    <span>{method.name}</span>
                  </Button>
                ))}
              </div>
              {selectedPaymentMethod === 'bank_transfer' && (
                <div className='mt-6'>
                  <h3 className='mb-3 text-lg font-semibold'>Select Bank</h3>
                  <RadioGroup
                    value={selectedBank}
                    onValueChange={setSelectedBank}
                    className='space-y-2'
                  >
                    {banks.map((bank) => (
                      <div
                        key={bank.code}
                        className='flex items-center p-3 border rounded-md'
                      >
                        <RadioGroupItem value={bank.code} id={bank.code} />
                        <Label htmlFor={bank.code} className='ml-3'>
                          {bank.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='sticky p-6 bg-white rounded-lg shadow-sm top-28'>
              <h2 className='pb-4 mb-4 text-xl font-semibold border-b'>
                Order Summary
              </h2>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Customer</span>
                  <span className='font-semibold'>
                    {payment?.user?.fullname}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Item Name</span>
                  <span className='font-semibold'>{item_name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Repair ID</span>
                  <span className='font-semibold'>{payment?.order_id}</span>
                </div>
              </div>
              <div className='pt-4 mt-4 space-y-2 text-sm border-t'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Repair Cost</span>
                  <span>{formatCurrency(payment?.amount)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Admin Fee</span>
                  <span>{formatCurrency(payment?.admin_fee)}</span>
                </div>
              </div>
              <div className='flex justify-between pt-4 mt-4 text-lg font-bold border-t'>
                <span>Total Payment</span>
                <span>{formatCurrency(payment?.total)}</span>
              </div>
              <Button
                className='w-full h-12 mt-6'
                onClick={handlePayNow}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
