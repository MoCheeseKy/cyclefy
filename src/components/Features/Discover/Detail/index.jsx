import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, MapPin, Phone, Loader2 } from 'lucide-react';

export default function Detail() {
  const router = useRouter();
  const { discover_type, id } = router.query;

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const fetchItemDetails = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('cyclefy_user_token');
      const endpoint =
        discover_type === 'borrowing' ? `/borrows/${id}` : `/barters/${id}`;
      const baseUrl = process.env.NEXT_PUBLIC_HOST;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setItem(response.data.data);
          if (
            response.data.data.images &&
            response.data.data.images.length > 0
          ) {
            setSelectedImage(response.data.data.images[0]);
          }
        } else {
          setError('Failed to fetch item details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the item.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [router.isReady, discover_type, id]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Item not found.</p>
      </div>
    );
  }

  const requestType = discover_type === 'borrowing' ? 'borrow' : 'barter';
  const postTypeCapitalized =
    discover_type.charAt(0).toUpperCase() + discover_type.slice(1);

  return (
    <div className='flex justify-center py-10 bg-[#F8F9FA] md:py-20'>
      <Wrapper>
        <div className='flex flex-wrap items-center gap-2 mb-8 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link
            href={`/features/${discover_type}`}
            className='text-text-primary'
          >
            {postTypeCapitalized}
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link
            href={`/features/discover/${discover_type}`}
            className='text-text-primary'
          >
            Search for Items
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <span className='font-bold truncate text-tertiary'>
            {item.item_name}
          </span>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div>
            <div
              className='w-full h-64 bg-gray-200 rounded-lg bg-cover bg-center mb-4 transition-all sm:h-80 lg:h-[400px]'
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
            <div className='flex items-center gap-2 pb-2 overflow-x-auto'>
              {item.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${
                    selectedImage === img
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <div
                    className='w-full h-full bg-center bg-cover'
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col'>
            <span className='self-start px-3 py-1 mb-2 text-sm text-white rounded-full bg-primary'>
              {item.category.name}
            </span>
            <h1 className='text-2xl font-bold text-gray-800 md:text-4xl'>
              {item?.item_name}
            </h1>
            <div className='mt-4 space-y-3 text-gray-600'>
              <div className='flex items-center gap-2'>
                <User size={18} />
                <span>{item.user.username}</span>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin size={18} className='flex-shrink-0 mt-1' />
                <span>
                  {item.address.address} ({item.distance?.toFixed(1)} km)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone size={18} />
                <span>{item.phone.number}</span>
              </div>
            </div>
            <p className='mt-6 text-gray-700 whitespace-pre-wrap'>
              {item?.description}
            </p>
            <div className='flex-grow'></div>
            <Link href={`/features/request/${discover_type}/${id}`}>
              <Button className='w-full h-12 mt-8 text-lg bg-primary hover:bg-primary/90'>
                Request This Item
              </Button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
