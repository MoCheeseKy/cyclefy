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
            className='text-text-primary'
          >
            Search for Items to Borrow
          </Link>
          <ChevronRight className='text-secondary' />
          <span className='text-secondary'>Request to Borrow</span>
        </div>
        <div className='flex items-center gap-4 my-4'>
          <div className='w-16 h-16 bg-gray-200 rounded-full' />
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
            <Step number='1' title='Prepare Your Item'>
              Clean it, make sure it’s still functional, and ready to be
              swapped.
            </Step>
            <Step number='2' title='Offer Your Item'>
              In the Request to Barter form, choose how to offer your item:
              <ul className='mt-2 ml-4 space-y-1 list-disc'>
                <li>
                  <b>To post a new form:</b> Manually enter item details.
                </li>
                <li>
                  <b>Use existing item:</b> Select from items you{"'"}ve
                  previously posted.
                </li>
              </ul>
            </Step>
            <Step number='3' title='Submit & Confirm'>
              Tap Send Request. The item owner will be notified. If they{"'"}re
              interested in your offer, you{"'"}ll be contacted to arrange the
              exchange.
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
