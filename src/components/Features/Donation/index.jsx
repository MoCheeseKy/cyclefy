import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

import { History, ChevronRight } from 'lucide-react';

export default function Donation() {
  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        <div className='flex items-center gap-2 text-base font-medium'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href={`/features/donation`} className='font-bold text-tertiary'>
            Donation
          </Link>
        </div>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-3'>
            <h1 className='text-[30px] font-bold'>Donation</h1>
          </div>
          <p className='text-center text-gray-600'>
            Donate unused items to others who can benefit from them, reducing
            waste and supporting the community.
          </p>
        </div>
        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-donation-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>Donate Your Item</p>
              </div>
              <p className='text-lg'>
                Donate unused items to others who can benefit from them,
                reducing waste by filling out the donation form with your item
                details.
              </p>
            </div>
            <Link href='/features/post-item/donation'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center justify-between gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-white rounded-full flex justify-center items-center text-black'>
                  <History size={42} />
                </div>
                <p className='text-xl font-semibold'>
                  View Your Donation History
                </p>
              </div>
              <p className='text-lg'>
                Check your past donations to see the items you{"'"}ve
                contributed and their current status
              </p>
            </div>
            <Link href='/user/histories/donation'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
