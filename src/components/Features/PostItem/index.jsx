import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import PostForm from './PostForm';

import { ChevronRight } from 'lucide-react';

export default function PostItem() {
  const router = useRouter();
  const { post_type } = router.query;

  const [PostType, setPostType] = useState('Donation');
  const [PostDescription, setPostDescription] = useState('');
  useEffect(() => {
    if (post_type === 'donation') {
      setPostType('Donation');
      setPostDescription(
        'Donate unused items to others who can benefit from them, reducing waste by filling out the donation form with your item details.'
      );
    } else if (post_type === 'borrowing') {
      setPostType('Borrowing');
      setPostDescription(
        'Offer items for temporary borrowing to others in your community. List your items and set the borrowing terms for a mutually beneficial arrangement.'
      );
    } else if (post_type === 'barter') {
      setPostType('Barter');
      setPostDescription(
        'Offer your items for exchange with others. List the items and the terms of the barter, so you can make deals that benefit both sides.'
      );
    } else if (post_type === 'recycling-repair') {
      setPostType('Recycling & Repair');
      setPostDescription(
        'Donate unused items to others who can benefit from them, reducing waste by filling out the donation form with your item details.'
      );
    }
  }, [post_type]);

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
          <Link href={`/features/${post_type}`} className='text-text-primary'>
            {PostType}
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/' className='font-bold text-tertiary'>
            Post Your Item
          </Link>
        </div>
        <div className='flex my-[10px] items-center gap-[10px]'>
          <div
            className={`w-[60px] h-[60px] ${
              post_type === 'donation'
                ? 'bg-donation-logo'
                : post_type === 'barter'
                ? 'bg-barter-logo'
                : 'bg-borrowing-logo'
            } rounded-full`}
          />
          <p className='text-[30px] font-bold'>{PostType} Your Item</p>
        </div>
        <p className='text-lg '>{PostDescription}</p>
        <div className='flex gap-[70px] mt-[30px] justify-between'>
          <div className='flex flex-col gap-4'>
            <p className='text-[30px] font-bold'>
              How To {PostType} Your Item?
            </p>
            {/* Step 1 */}
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                  1
                </div>
                <div className='text-xl font-bold'>Prepare Your Item</div>
              </div>
              <p className='text-base pl-[62px]'>
                Clean it, make sure it’s still functional, and ready to be
                swapped.
              </p>
            </div>
            {/* Step 2 */}
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                  2
                </div>
                <div className='text-xl font-bold'>Complete the Form</div>
              </div>
              <p className='text-base pl-[62px]'>
                Enter your item name (e.g., <b>Electric Kettle</b>), a clear
                description (e.g.,{' '}
                <b>
                  Teko pemanas air elektrik, kapasitas 1.7L, baru dipakai
                  beberapa kali.
                </b>
                ), choose a category, location, and contact info. Don’t forget
                to upload photos.
              </p>
            </div>
            {/* Step 3 */}
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                  3
                </div>
                <div className='text-xl font-bold'>Submit & Confirm</div>
              </div>
              <p className='text-base pl-[62px]'>
                Tap Post This Item. Your item will appear in the {PostType}{' '}
                List. Other users can now offer their items to you. Track
                progress in {PostType} History.
              </p>
            </div>
          </div>
          <PostForm />
        </div>
      </Wrapper>
    </div>
  );
}
