import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import PostForm from './PostForm';

import { ChevronRight } from 'lucide-react';

export default function PostItem() {
  const router = useRouter();
  const { post_type } = router.query;
  const [PostType, setPostTypeDisplay] = useState('Donation');
  const [PostDescription, setPostDescription] = useState('');

  useEffect(() => {
    if (post_type) {
      if (post_type === 'donation') {
        setPostTypeDisplay('Donation');
        setPostDescription(
          'Donate unused items to others who can benefit from them, reducing waste by filling out the donation form with your item details.'
        );
      } else if (post_type === 'borrowing') {
        setPostTypeDisplay('Borrowing');
        setPostDescription(
          'Offer items for temporary borrowing to others in your community. List your items and set the borrowing terms for a mutually beneficial arrangement.'
        );
      } else if (post_type === 'barter') {
        setPostTypeDisplay('Barter');
        setPostDescription(
          'Offer your items for exchange with others. List the items and the terms of the barter, so you can make deals that benefit both sides.'
        );
      }
    }
  }, [post_type]);

  console.log(post_type);

  return (
    <div className='flex justify-center py-10 md:py-20'>
      <Wrapper>
        <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link href='/' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link href={`/features/${post_type}`} className='text-text-primary'>
            {PostType}
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <span className='font-bold text-tertiary'>Post Your Item</span>
        </div>

        <div className='flex items-center gap-4 my-4 md:my-6 md:gap-5'>
          <div
            className={`w-12 h-12 md:w-16 md:h-16 bg-cover bg-center rounded-full flex-shrink-0 ${
              post_type === 'donation'
                ? 'bg-donation-logo'
                : post_type === 'barter'
                ? 'bg-barter-logo'
                : 'bg-borrowing-logo'
            }`}
          />
          <p className='text-2xl font-bold md:text-3xl'>{PostType} Your Item</p>
        </div>
        <p className='text-base md:text-lg'>{PostDescription}</p>

        <div className='flex flex-col gap-12 mt-8 lg:flex-row lg:gap-16 md:mt-12 lg:justify-between'>
          <div className='flex flex-col flex-1 order-2 gap-6 lg:order-none'>
            <p className='text-2xl font-bold md:text-3xl'>
              How To {PostType} Your Item?
            </p>
            {/* Steps */}
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full aspect-square bg-primary md:text-3xl'>
                  1
                </div>
                <div className='text-lg font-bold md:text-xl'>
                  Prepare Your Item
                </div>
              </div>
              <p className='pl-16 text-base'>
                Clean it, make sure it’s still functional, and ready to be
                swapped.
              </p>
            </div>
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full aspect-square bg-primary md:text-3xl'>
                  2
                </div>
                <div className='text-lg font-bold md:text-xl'>
                  Complete the Form
                </div>
              </div>
              <p className='pl-16 text-base'>
                Add item name (e.g., <b>Buku & Alat Tulis</b>) & a description
                (e.g.,
                <b>
                  Buku pelajaran, catatan kuliah, dan alat tulis bekas yang
                  masih bisa dimanfaatkan untuk mendukung pendidikan
                </b>
                .), choose a category, fill address and contact number, then
                upload photos.
              </p>
            </div>
            <div>
              <div className='flex items-center gap-4 mb-2'>
                <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full aspect-square bg-primary md:text-3xl'>
                  3
                </div>
                <div className='text-lg font-bold md:text-xl'>
                  Submit & Confirm
                </div>
              </div>
              <p className='pl-16 text-base'>
                Tap Post This Item. Your item will appear in the {PostType}{' '}
                List. Other users can now see your item. Track progress in{' '}
                {PostType} History.
              </p>
            </div>
          </div>
          <div className='flex justify-center w-full lg:w-auto lg:justify-start'>
            <PostForm />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
