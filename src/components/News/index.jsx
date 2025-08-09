import Wrapper from '../_shared/Wrapper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

import { FaFilter, FaSort } from 'react-icons/fa';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        {/* Header */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <div className='w-[60px] h-[60px] bg-[#252525] rounded-full'></div>
            <h1 className='text-[30px] font-bold'>Explore News</h1>
          </div>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Search & Filters */}
        <div className='grid grid-cols-12 gap-3 mt-6'>
          <div className='flex items-center w-full col-span-8 px-3 bg-white border border-gray-300 rounded-md'>
            <Search className='w-4 h-4 text-gray-400' />
            <Input
              type='text'
              placeholder='Search for items...'
              className='w-full border-0 focus-visible:ring-0'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className='flex items-center justify-between col-span-2 text-white bg-primary hover:bg-gray-300'>
            Filters
            <FaFilter />
          </Button>
          <Button className='flex items-center justify-between col-span-2 text-white bg-primary hover:bg-gray-300'>
            Sort by
            <FaSort />
          </Button>
        </div>

        {/* News Grid */}
        <div className='w-full grid grid-cols-4 gap-[30px] mt-[30px]'>
          {[1, 2, 3, 4, 5, 6, 7, 8]?.map((news, newsIndex) => (
            <div key={newsIndex} className='flex flex-col gap-[10px]'>
              <div className='bg-[#252525] w-full aspect-square rounded-[12px]'></div>
              <p className='text-lg'>Lorem Ipsum dulu {news}</p>
              <p className='text-xs font-light'>by Lorem • July 15, 2025</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-center gap-2 mt-8'>
          <Button
            variant='secondary'
            className='w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300'
          >
            {'<'}
          </Button>
          {[1, 2, 3, 4, 5]?.map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'default' : 'secondary'}
              className={`w-8 h-8 rounded-full ${
                page === 1
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </Button>
          ))}
          <span className='text-gray-500'>... 11</span>
          <Button
            variant='secondary'
            className='w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300'
          >
            {'>'}
          </Button>
        </div>
      </Wrapper>
    </div>
  );
}
