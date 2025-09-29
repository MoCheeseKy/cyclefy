import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

import { History, ChevronRight } from 'lucide-react';

export default function RecyclingRepair() {
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
          <Link
            href={`/features/recycling-repair`}
            className='font-bold text-tertiary'
          >
            Recycling & Repair
          </Link>
        </div>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-3'>
            <h1 className='text-[30px] font-bold'>Recycling & Repair</h1>
          </div>
          <p className='text-center text-gray-600'>
            Borrow or lend items with others, helping reduce waste and promoting
            a sharing economy among students.
          </p>
        </div>
        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-recycle-repair-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>Recycle Your Item</p>
              </div>
              <p className='text-lg'>
                Give your unused items a second life. Post them for recycling
                and let others repurpose or reuse them sustainably.
              </p>
            </div>
            <Link href='/features/recycling-repair/recycling'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-secondary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-recycle-repair-logo bg-cover bg-no-repeat rounded-full'></div>
                <p className='text-xl font-semibold'>Repair Your Item</p>
              </div>
              <p className='text-lg'>
                Fix what’s broken instead of throwing it away. Submit your item
                for repair and extend its usability while reducing waste.
              </p>
            </div>
            <Link href='/features/recycling-repair/repair'>
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
                  View Your Repair History
                </p>
              </div>
              <p className='text-lg'>
                Check your Recycling & Repair History to see what items you{"'"}
                ve borrowed in the past and their current status.
              </p>
            </div>
            <Link href='/user/histories/repair'>
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
                  View Your Recycling History
                </p>
              </div>
              <p className='text-lg'>
                Check your Recycling & Repair History to see what items you{"'"}
                ve borrowed in the past and their current status.
              </p>
            </div>
            <Link href='/user/histories/recycle'>
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
