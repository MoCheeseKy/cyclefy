import { useRouter } from 'next/router';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import RequestBorrowForm from './RequestForm';

import { ChevronRight } from 'lucide-react';

export default function RequestBorrow() {
  const router = useRouter();
  const { id } = router.query;

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
          <Link href='/features/borrowing' className='text-text-primary'>
            Borrow
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link
            href='/features/discover/borrowing'
            className='font-bold text-tertiary'
          >
            Search for Items to Borrow
          </Link>
        </div>
        <div className='flex items-center gap-4 my-4'>
          <div className='w-[60px] aspect-square bg-borrowing-logo bg-cover bg-no-repeat rounded-full'></div>
          <h1 className='text-3xl font-bold'>Request to Borrow</h1>
        </div>
        <p className='max-w-4xl text-lg text-gray-600'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className='grid grid-cols-1 gap-16 mt-8 lg:grid-cols-2'>
          {/* Kolom Kiri: Instruksi */}
          <div className='flex flex-col gap-6'>
            <h2 className='text-3xl font-bold'>How To Request a Borrow?</h2>
            <Step number='1' title='Review the Item Details'>
              Make sure the item suits your needs and is available on the dates
              you intend to borrow it. Read the description, availability, and
              location carefully.
            </Step>
            <Step number='2' title='Fill Out the Request Form'>
              Provide a clear reason for borrowing (e.g.,{' '}
              <b>
                Saya sedang tinggal di kos dan belum punya teko listrik sendiri.
                Teko ini akan sangat membantu untuk membuat air hangat, menyeduh
                teh, atau memasak mie instan dengan praktis, terutama saat malam
                hari atau ketika sedang terburu-buru. Saya akan menjaga barang
                ini dengan baik dan mengembalikannya sesuai waktu yang
                disepakati
              </b>
              ), your address, and contact number.Then, select the borrowing
              duration by setting the start and end dates. Be honest and
              realistic with your timeframe.
            </Step>
            <Step number='3' title='Submit & Confirm'>
              Click Send Request. The item owner will receive your request and
              decide whether to approve or decline it. You can check the status
              of your request in your Borrowing History.
            </Step>
          </div>

          {/* Kolom Kanan: Form */}
          <div className='w-full space-y-6'>
            <RequestBorrowForm />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
