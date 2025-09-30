import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, Phone, Loader2 } from 'lucide-react';
import ConfirmLocationModal from './ConfirmLocationModal';
import FinalSuccessModal from './FinalSuccessModal';

export default function LocationDetail({ id, formDataFromParent, setPage }) {
  const { toast } = useToast();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError('Invalid location ID.');
      return;
    }

    const fetchItemDetails = async () => {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('cyclefy_user_token');
      const endpoint = `/recycle-locations/${id}`;
      const baseUrl = process.env.NEXT_PUBLIC_HOST;

      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const data = response.data.data;
          setItem(data);
          if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0]);
          }
        } else {
          setError('Failed to fetch location details.');
        }
      } catch (err) {
        setError('An error occurred while fetching the location.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsConfirmModalOpen(false);
    const token = localStorage.getItem('cyclefy_user_token');
    const endpoint = '/recycles';
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const finalFormData = new FormData();

    if (formDataFromParent) {
      for (let [key, value] of formDataFromParent.entries()) {
        finalFormData.append(key, value);
      }
    }

    finalFormData.append('recycle_location_id', id);

    try {
      await axios.post(`${baseUrl}${endpoint}`, finalFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSuccessModalOpen(true);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Loader2 className='w-8 h-8 text-gray-500 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p>Location not found.</p>
      </div>
    );
  }

  return (
    <>
      <Wrapper>
        <div className='flex flex-wrap items-center gap-2 mb-8 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link
            href='/features/recycling-repair/recycling'
            className='text-text-primary'
          >
            Recycling
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <span className='font-bold truncate text-tertiary'>
            {item.location_name}
          </span>
        </div>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div>
            <div
              className='w-full h-64 md:h-[400px] bg-gray-200 rounded-lg bg-cover bg-center mb-4 transition-all'
              style={{ backgroundImage: `url(${selectedImage})` }}
            ></div>
            <div className='flex items-center gap-2 pb-2 overflow-x-auto'>
              {item.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
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
            <h1 className='text-3xl font-bold text-gray-800 md:text-4xl'>
              {item?.location_name}
            </h1>
            <div className='mt-4 space-y-3 text-gray-600'>
              <div className='flex items-start gap-3'>
                <MapPin size={18} className='flex-shrink-0 mt-1' />
                <span>
                  {item?.address}
                  {item?.distance &&
                    ` (${parseFloat(item.distance).toFixed(1)} km)`}
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone size={18} />
                <span>{item?.phone || 'No phone number available'}</span>
              </div>
              <div className='py-2'>
                <span className='font-semibold'>Available for:</span>{' '}
                {item?.categories.map((cat) => cat.name).join(', ')}
              </div>
            </div>
            <p className='mt-6 text-gray-700 whitespace-pre-wrap'>
              {item?.description}
            </p>
            <div className='flex-grow'></div>
            <Button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={isSubmitting}
              className='w-full h-12 mt-8 text-lg text-white bg-primary hover:bg-primary/90 disabled:bg-gray-400'
            >
              Select This Location
            </Button>
          </div>
        </div>
      </Wrapper>
      <ConfirmLocationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        isLoading={isSubmitting}
        locationName={item?.location_name}
      />
      <FinalSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setPage('form')}
      />
    </>
  );
}
