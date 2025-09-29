import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

import { ChevronRight, History } from 'lucide-react';

export default function Barter() {
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
          <Link href={`/features/barter`} className='font-bold text-tertiary'>
            Barter
          </Link>
        </div>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-3'>
            <h1 className='text-[30px] font-bold'>Barter</h1>
          </div>
          <p className='text-center text-gray-600'>
            Swap items you no longer need with others, creating a sustainable
            way to exchange resources.
          </p>
        </div>
        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-barter-logo bg-no-repeat bg-cover rounded-full'></div>
                <p className='text-xl font-semibold'>
                  Post Your Item for Barter
                </p>
              </div>
              <p className='text-lg'>
                Offer your items for exchange with others. List the items and
                the terms of the barter, so you can make deals that benefit both
                sides.
              </p>
            </div>
            <Link href='/features/post-item/barter'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-barter-logo bg-no-repeat bg-cover rounded-full transform -scale-x-100'></div>
                <p className='text-xl font-semibold'>
                  Search for Items to Barter
                </p>
              </div>
              <p className='text-lg'>
                Browse available items for barter and find something you need.
                Check out the listing, and contact the owner to make an
                exchange.
              </p>
            </div>
            <Link href='/features/discover/barter'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-white rounded-full flex justify-center items-center text-black'>
                  <History size={42} />
                </div>
                <p className='text-xl font-semibold'>
                  View Your Barter History
                </p>
              </div>
              <p className='text-lg'>
                Review the barter deals you{"'"}ve made and see how your
                exchanges have worked out over time.
              </p>
            </div>
            <Link href='/user/histories/barter'>
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
