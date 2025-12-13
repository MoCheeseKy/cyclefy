import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

import { History, ChevronRight } from 'lucide-react';

export default function Borrowing() {
  return (
    <div className='flex justify-center py-10 md:py-20'>
      <Wrapper>
        <div className='flex items-center gap-2 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link
            href={`/features/borrowing`}
            className='font-bold text-tertiary'
          >
            Borrow
          </Link>
        </div>
        {/* Header */}
        <div className='flex flex-col gap-2 mt-8'>
          <div className='flex items-center justify-center gap-3'>
            <h1 className='text-2xl font-bold md:text-[30px]'>Borrowing</h1>
          </div>
          <p className='text-center text-gray-600'>
            Borrow or lend items with others, helping reduce waste and promoting
            a sharing economy among students.
          </p>
        </div>
        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/* Card 1 */}
          <div className='bg-secondary text-white rounded-[16px] flex flex-col md:flex-row md:items-center gap-6 md:gap-[25px] p-6 md:px-[46px] md:py-[30px]'>
            <div className='flex flex-col flex-grow gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-borrowing-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>
                  Post Your Item for Borrowing
                </p>
              </div>
              <p className='text-base md:text-lg'>
                Offer items for temporary borrowing to others in your community.
                List your items and set the borrowing terms for a mutually
                beneficial arrangement.
              </p>
            </div>
            <Link
              href='/features/post-item/borrowing'
              className='w-full md:w-auto'
            >
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] w-full md:w-auto md:min-w-[131px] font-semibold'>
                View More
              </button>
            </Link>
          </div>
          {/* Card 2 */}
          <div className='bg-secondary text-white rounded-[16px] flex flex-col md:flex-row md:items-center gap-6 md:gap-[25px] p-6 md:px-[46px] md:py-[30px]'>
            <div className='flex flex-col flex-grow gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-borrowing-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>
                  Search for Items to Borrow
                </p>
              </div>
              <p className='text-base md:text-lg'>
                Find items you need by browsing through other people’s offerings
                for borrowing. Reach out to the item owners and make an
                agreement to borrow what you need.
              </p>
            </div>
            <Link
              href='/features/discover/borrowing'
              className='w-full md:w-auto'
            >
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] w-full md:w-auto md:min-w-[131px] font-semibold'>
                View More
              </button>
            </Link>
          </div>
          {/* Card 3 */}
          <div className='bg-secondary text-white rounded-[16px] flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-[25px] p-6 md:px-[46px] md:py-[30px]'>
            <div className='flex flex-col flex-grow gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-white rounded-full flex justify-center items-center text-black'>
                  <History size={42} />
                </div>
                <p className='text-xl font-semibold'>
                  View Your Borrowing History
                </p>
              </div>
              <p className='text-base md:text-lg'>
                Check your borrowing history to see what items you{"'"}ve
                borrowed in the past and their current status.
              </p>
            </div>
            <Link
              href='/user/histories/borrow?history_type=borrow'
              className='w-full md:w-auto'
            >
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] w-full md:w-auto md:min-w-[131px] font-semibold'>
                View More
              </button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
