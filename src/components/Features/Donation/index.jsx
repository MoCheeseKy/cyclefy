import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';
import { History, ChevronRight } from 'lucide-react';

export default function Donation() {
  return (
    // Responsive change: Mengurangi padding vertikal di mobile
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
          <Link href={`/features/donation`} className='font-bold text-tertiary'>
            Donation
          </Link>
        </div>

        {/* Header */}
        <div className='flex flex-col gap-2 mt-8'>
          <div className='flex items-center justify-center gap-3'>
            <h1 className='text-2xl font-bold md:text-[30px]'>Donation</h1>
          </div>
          <p className='text-center text-gray-600'>
            Donate unused items to others who can benefit from them, reducing
            waste and supporting the community.
          </p>
        </div>

        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/* Card 1: Donate Your Item */}
          <div className='bg-secondary text-white rounded-[16px] flex flex-col md:flex-row md:items-center gap-6 md:gap-[25px] p-6 md:px-[46px] md:py-[30px]'>
            <div className='flex flex-col flex-grow gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-donation-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>Donate Your Item</p>
              </div>
              <p className='text-base md:text-lg'>
                Donate unused items to others who can benefit from them,
                reducing waste by filling out the donation form with your item
                details.
              </p>
            </div>
            <Link
              href='/features/post-item/donation'
              className='w-full md:w-auto'
            >
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] w-full md:w-auto md:min-w-[131px] font-semibold'>
                View More
              </button>
            </Link>
          </div>

          {/* Card 2: Donation History */}
          <div className='bg-secondary text-white rounded-[16px] flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-[25px] p-6 md:px-[46px] md:py-[30px]'>
            <div className='flex flex-col flex-grow gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-white rounded-full flex justify-center items-center text-black'>
                  <History size={42} />
                </div>
                <p className='text-xl font-semibold'>
                  View Your Donation History
                </p>
              </div>
              <p className='text-base md:text-lg'>
                Check your past donations to see the items you{"'"}ve
                contributed and their current status
              </p>
            </div>
            <Link
              href='/user/histories/donation?history_type=donation'
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
