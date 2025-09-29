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

  // State untuk memastikan render hanya di client dan mengatasi hydration error
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mencegah render komponen anak di server-side untuk menghindari error
  if (!isClient) {
    return null;
  }

  const renderCurrentPage = () => {
    switch (page) {
      case 'form':
        return (
          <>
            <div className='flex items-center gap-2 text-base font-medium'>
              <Link href='/' className='text-text-primary'>
                Cyclefy
              </Link>
              <ChevronRight className='text-text-primary' />
              <Link href='/features' className='text-text-primary'>
                Key Features
              </Link>
              <ChevronRight className='text-text-primary' />
              <Link
                href='/features/recycling-repair'
                className='text-text-primary'
              >
                Recycling & Repair
              </Link>
              <ChevronRight className='text-text-primary' />
              <Link href='/features/repair' className='font-bold text-tertiary'>
                Post Your Item
              </Link>
            </div>
            <div className='flex my-[10px] items-center gap-[10px]'>
              <div className='w-[60px] h-[60px] bg-recycle-repair-logo bg-cover bg-no-repeat rounded-full' />
              <p className='text-[30px] font-bold'>Recycling Your Item</p>
            </div>
            <p className='text-lg'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className='flex flex-col lg:flex-row gap-[70px] mt-[30px] justify-between'>
              <div className='flex flex-col gap-4'>
                <p className='text-[30px] font-bold'>
                  How To Recycle Your Item?
                </p>
                {/* Step 1 */}
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                      1
                    </div>
                    <div className='text-xl font-bold'>
                      Choose an Item to Recycle
                    </div>
                  </div>
                  <p className='text-base pl-[62px]'>
                    Pick an item that you no longer use but still has parts or
                    materials that can be recycled or repurposed (e.g., broken
                    electronics, used containers, old furniture).
                  </p>
                </div>
                {/* Step 2 */}
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                      2
                    </div>
                    <div className='text-xl font-bold'>
                      Fill in the Recycling Form
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
                {/* Step 3 */}
                <div>
                  <div className='flex items-center gap-4 mb-2'>
                    <div className='w-[48px] aspect-square rounded-full bg-primary text-white flex items-center justify-center font-bold text-[30px]'>
                      3
                    </div>
                    <div className='text-xl font-bold'>
                      Submit for Recycling
                    </div>
                  </div>
                  <p className='text-base pl-[62px]'>
                    Click Recycle This Item. Your post will appear on the
                    Recycling List so others can request or pick it up for
                    recycling or reuse purposes. Monitor updates via the
                    Recycling History page.
                  </p>
                </div>
              </div>
              <PostRecyclingItemForm
                setFormData={setFormData}
                setPage={setPage}
              />
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
    <div className='flex justify-center py-20'>
      <Wrapper>{renderCurrentPage()}</Wrapper>
    </div>
  );
}
