import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';
import { Loader2, Copy } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';

const formatTimeLeft = (seconds) => {
  if (seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const PaymentInstruction = ({ status }) => {
  const { toast } = useToast();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Virtual account number copied to clipboard.',
    });
  };

  switch (status.payment_type) {
    case 'bank_transfer':
      return (
        <div className='p-6 text-center text-white bg-gray-800 rounded-lg'>
          {/* PERBAIKAN: Tambahkan optional chaining (?) dan fallback value */}
          <p className='font-semibold'>
            {status.bank_code?.toUpperCase() || 'Bank Transfer'}
          </p>
          <p className='mt-4 text-sm text-gray-300'>
            Account number / Virtual account
          </p>
          <div className='flex items-center justify-between p-3 mt-2 bg-gray-700 rounded-md'>
            <span className='font-mono text-lg'>{status.va_number}</span>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleCopy(status.va_number)}
            >
              <Copy className='w-4 h-4' />
            </Button>
          </div>
        </div>
      );
    case 'qris':
      return (
        <div className='p-6 text-center text-white bg-gray-800 rounded-lg'>
          <p className='font-semibold'>QRIS</p>
          <div className='p-4 mt-2 bg-white rounded-md'>
            {status.qr_url ? (
              <Image
                src={status.qr_url}
                alt='QRIS Code'
                width={200}
                height={200}
                className='mx-auto'
              />
            ) : (
              <p className='text-black'>QR Code not available.</p>
            )}
          </div>
          <p className='mt-2 text-xs text-gray-400'>
            NMDI: {status.nmid || 'XXXXXXXXXXXXXXXX'}
          </p>
        </div>
      );
    case 'ewallet':
      return (
        <div className='p-6 text-center text-white bg-gray-800 rounded-lg'>
          <p className='font-semibold capitalize'>
            {status.ewallet_type || 'E-Wallet'}
          </p>
          <p className='mt-4 text-sm text-gray-300'>
            Account number / Virtual account
          </p>
          <div className='flex items-center justify-between p-3 mt-2 bg-gray-700 rounded-md'>
            <span className='font-mono text-lg'>{status.va_number}</span>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleCopy(status.va_number)}
            >
              <Copy className='w-4 h-4' />
            </Button>
          </div>
        </div>
      );
    default:
      return <p>Payment instruction not available.</p>;
  }
};

export default function RepairPayNow() {
  const router = useRouter();
  const { id: repairId } = router.query;
  const { toast } = useToast();

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchPaymentStatus = useCallback(async () => {
    if (!repairId) return;
    const token = localStorage.getItem('cyclefy_user_token');
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/repairs/${repairId}/payment-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const statusData = response.data.data;

      if (statusData.status === 'paid') {
        toast({
          title: 'Payment Successful',
          description: 'Redirecting to your history...',
        });
        router.replace('/user/histories?history_type=repair');
        return; // Hentikan eksekusi lebih lanjut
      }

      setPaymentStatus(statusData);
      const expiryDate = new Date(statusData.expired_at);
      const now = new Date();
      const secondsRemaining = differenceInSeconds(expiryDate, now);
      setTimeLeft(secondsRemaining > 0 ? secondsRemaining : 0);
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch payment status.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [repairId, router, toast]);

  useEffect(() => {
    if (router.isReady) {
      fetchPaymentStatus();
    }
  }, [router.isReady, fetchPaymentStatus]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const poller = setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        paymentStatus?.status !== 'paid'
      ) {
        fetchPaymentStatus();
      }
    }, 10000);
    return () => clearInterval(poller);
  }, [fetchPaymentStatus, paymentStatus]);

  if (isLoading || !paymentStatus) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-gray-800'>
      <div className='grid w-full max-w-4xl grid-cols-1 overflow-hidden bg-white shadow-2xl rounded-2xl md:grid-cols-2'>
        <div className='flex flex-col justify-center p-8'>
          <div className='text-center'>
            <p className='text-gray-600'>Complete the payment within</p>
            <p className='my-2 text-5xl font-bold tracking-wider text-gray-800'>
              {formatTimeLeft(timeLeft)}
            </p>
            <p className='text-sm text-gray-500'>
              Due on{' '}
              {format(
                new Date(paymentStatus.expired_at),
                'MMMM dd, yyyy, HH:mm'
              )}
            </p>
          </div>
          <div className='flex items-center justify-between my-8 text-lg'>
            <span className='text-gray-600'>Total Payment</span>
            <span className='font-bold text-gray-800'>
              {formatCurrency(paymentStatus.total)}
            </span>
          </div>
          <PaymentInstruction status={paymentStatus} />
        </div>

        <div className='flex flex-col p-8 text-white bg-primary'>
          <div className='mb-8 text-center'>
            <h2 className='text-2xl font-bold'>Cyclefy</h2>
          </div>
          <div>
            <h3 className='mb-2 text-lg font-semibold'>How to Pay?</h3>
            <ol className='space-y-2 text-sm text-gray-200 list-decimal list-inside'>
              <li>
                Choose your preferred payment method on the previous screen.
              </li>
              <li>
                Take note of the virtual account number or scan the provided QR
                code.
              </li>
              <li>
                Open your banking app or e-wallet and go to the transfer/payment
                section.
              </li>
              <li>Complete the payment before the timer ends.</li>
              <li>
                Once payment is made, the system will automatically verify it.
                You{"'"}ll receive a confirmation shortly.
              </li>
            </ol>
          </div>
          <div className='pt-6 mt-auto border-t border-green-600'>
            <h3 className='mb-2 text-lg font-semibold'>Order Summary</h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-300'>Customer</span>
                <span>{paymentStatus.customer}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-300'>Item Name</span>
                <span>{paymentStatus.item_name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-300'>Repair ID</span>
                <span>{paymentStatus.order_id}</span>
              </div>
              <hr className='my-2 border-green-600' />
              <div className='flex justify-between'>
                <span className='text-gray-300'>Repair Cost</span>
                <span>{formatCurrency(paymentStatus.amount)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-300'>Admin Fee</span>
                <span>{formatCurrency(paymentStatus.admin_fee)}</span>
              </div>
              <div className='flex justify-between mt-2 text-base font-bold'>
                <span>Total Payment</span>
                <span>{formatCurrency(paymentStatus.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
