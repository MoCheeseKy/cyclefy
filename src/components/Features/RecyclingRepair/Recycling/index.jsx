import { useState, useEffect } from 'react';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import PostRecyclingItemForm from './PostForm';
import FindRecyclingLocation from './FindLocation';
import LocationDetail from './LocationDetail';
import { ChevronRight } from 'lucide-react';

export default function PostRecyclingItem() {
  const [page, setPage] = useState('form');
  const [formData, setFormData] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  const renderCurrentPage = () => {
    switch (page) {
      case 'form':
        return (
          <>
            <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
              <Link href='/' className='text-text-primary'>
                Cyclefy
              </Link>
              <ChevronRight className='w-4 h-4 text-text-primary' />
              <Link
                href='/features/recycling-repair'
                className='text-text-primary'
              >
                Recycling & Repair
              </Link>
              <ChevronRight className='w-4 h-4 text-text-primary' />
              <span className='font-bold text-tertiary'>Recycle Your Item</span>
            </div>
            <div className='flex items-center gap-4 my-6'>
              <div className='w-12 h-12 bg-no-repeat bg-cover rounded-full md:w-16 md:h-16 bg-recycle-repair-logo' />
              <h1 className='text-2xl font-bold md:text-3xl'>
                Recycle Your Item
              </h1>
            </div>
            <p className='text-base text-gray-600 md:text-lg'>
              Give your unused items a second life. Post them for recycling and
              let others repurpose or reuse them sustainably.
            </p>
            <div className='flex flex-col gap-12 mt-8 lg:flex-row lg:gap-16 md:mt-12'>
              <div className='flex flex-col flex-1 gap-6'>
                <h2 className='text-2xl font-bold md:text-3xl'>
                  How To Recycle Your Item?
                </h2>
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full md:text-3xl bg-primary'>
                      1
                    </div>
                    <div className='text-lg font-bold md:text-xl'>
                      Choose an Item
                    </div>
                  </div>
                  <p className='pl-16 text-base'>
                    Pick an item that you no longer use but still has parts or
                    materials that can be recycled or repurposed.
                  </p>
                </div>
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full md:text-3xl bg-primary'>
                      2
                    </div>
                    <div className='text-lg font-bold md:text-xl'>
                      Fill in the Form
                    </div>
                  </div>
                  <p className='text-base pl-[62px]'>
                    Enter the item name (e.g., <b>Kardus Bekas TV 32 Inch</b>),
                    a short description (e.g.,{' '}
                    <b>
                      Kardus tebal bekas kemasan TV, masih utuh dan bisa
                      digunakan ulang atau didaur ulang sebagai bahan kertas
                    </b>
                    .), select a suitable category, your address, and contact
                    number. Upload a photo of the item to help others understand
                    its condition.
                  </p>
                </div>
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl font-bold text-white rounded-full md:text-3xl bg-primary'>
                      3
                    </div>
                    <div className='text-lg font-bold md:text-xl'>
                      Find a Location
                    </div>
                  </div>
                  <p className='pl-16 text-base'>
                    After submitting the form, find a suitable recycling
                    location from the list provided to send your item to.
                  </p>
                </div>
              </div>
              <div className='flex justify-center w-full lg:w-auto lg:justify-start'>
                <PostRecyclingItemForm
                  setFormData={setFormData}
                  setPage={setPage}
                />
              </div>
            </div>
          </>
        );
      case 'find-location':
        return (
          <FindRecyclingLocation
            setSelectedLocationId={setSelectedLocationId}
            setPage={setPage}
          />
        );
      case 'location-detail':
        return (
          <LocationDetail
            id={selectedLocationId}
            formDataFromParent={formData}
            setPage={setPage}
          />
        );
      default:
        setPage('form');
        return null;
    }
  };

  return (
    <div className='flex justify-center py-10 bg-gray-50 md:py-20'>
      <Wrapper>{renderCurrentPage()}</Wrapper>
    </div>
  );
}
