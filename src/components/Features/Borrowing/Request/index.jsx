import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import RequestBorrowForm from './RequestForm';

import { ChevronRight } from 'lucide-react';

export default function RequestBorrow() {
  const Step = ({ number, title, children }) => (
    <div>
      <div className='flex items-center gap-4 mb-2'>
        <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full bg-primary md:text-3xl'>
          {number}
        </div>
        <div className='text-lg font-bold md:text-xl'>{title}</div>
      </div>
      <div className='pl-16 text-base text-gray-600'>{children}</div>
    </div>
  );

  return (
    <div className='flex justify-center py-10 md:py-20'>
      <Wrapper>
        {/* Breadcrumbs & Header */}
        <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link href='/features/borrowing' className='text-text-primary'>
            Borrow
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link
            href='/features/discover/borrowing'
            className='font-bold text-tertiary'
          >
            Search for Items to Borrow
          </Link>
        </div>
        <div className='flex items-center gap-4 my-6'>
          <div className='flex-shrink-0 w-12 h-12 bg-no-repeat bg-cover rounded-full md:w-16 md:h-16 bg-borrowing-logo'></div>
          <h1 className='text-2xl font-bold md:text-3xl'>Request to Borrow</h1>
        </div>
        <p className='max-w-4xl text-base text-gray-600 md:text-lg'>
          Follow the steps below to submit your borrowing request. Make sure all
          the information you provide is accurate.
        </p>

        <div className='grid grid-cols-1 gap-12 mt-8 lg:grid-cols-2 lg:gap-16'>
          {/* Kolom Kiri: Instruksi */}
          <div className='flex flex-col order-2 gap-6 lg:order-none'>
            <h2 className='text-2xl font-bold md:text-3xl'>
              How To Request a Borrow?
            </h2>
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
          <div className='flex justify-center w-full lg:justify-end'>
            <RequestBorrowForm />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
