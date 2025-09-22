import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

export default function Borrowing() {
  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-3'>
            <div className='w-[60px] h-[60px] bg-[#252525] rounded-full'></div>
            <h1 className='text-[30px] font-bold'>Borrowing</h1>
          </div>
          <p className='text-center text-gray-600'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className='mt-[30px] flex flex-col gap-[30px]'>
          {/*  */}
          <div className='bg-primary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-[#252525] rounded-full'></div>
                <p className='text-xl font-semibold'>
                  Post Your Item for Borrowing
                </p>
              </div>
              <p className='text-lg'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <Link href='/features/post-item/borrowing'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-primary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-[#252525] rounded-full'></div>
                <p className='text-xl font-semibold'>
                  Search for Items to Borrow
                </p>
              </div>
              <p className='text-lg'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <Link href='/features/discover/borrowing'>
              <button className='bg-white text-primary rounded-[16px] px-[20px] py-[10px] min-w-[131px]'>
                View More
              </button>
            </Link>
          </div>
          {/*  */}
          <div className='bg-primary text-white rounded-[16px] flex items-center gap-[25px] px-[46px] py-[30px]'>
            <div className='flex flex-col gap-[10px]'>
              <div className='flex items-center gap-4'>
                <div className='w-[60px] aspect-square bg-[#252525] rounded-full'></div>
                <p className='text-xl font-semibold'>
                  View Your Borrowing History
                </p>
              </div>
              <p className='text-lg'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <Link href='/user/history/borrowing'>
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
