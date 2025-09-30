import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { format } from 'date-fns';

import Wrapper from '@/components/_shared/Wrapper';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, User, Calendar, ChevronRight } from 'lucide-react';

export default function NewsDetail() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = router.query;

  const [newsData, setNewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsDetail = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('cyclefy_user_token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/news/${id}`,
        { headers }
      );
      setNewsData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch news detail:', err);
      setError('The news article could not be found or an error occurred.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load the news article.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (router.isReady) {
      fetchNewsDetail();
    }
  }, [router.isReady, fetchNewsDetail]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-96'>
          <Loader2 className='w-10 h-10 text-primary animate-spin' />
        </div>
      );
    }

    if (error || !newsData) {
      return (
        <div className='flex flex-col items-center justify-center text-center h-96'>
          <h2 className='mb-2 text-2xl font-bold'>Oops!</h2>
          <p className='text-red-500'>
            {error || 'News data is not available.'}
          </p>
          <Button
            onClick={() => router.push('/news/discover')}
            className='mt-4 bg-primary hover:bg-primary/90'
          >
            Back to News
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className='flex flex-wrap items-center gap-2 mb-6 text-sm text-gray-500 md:mb-8 md:text-base'>
          <Link href='/' className='hover:text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4' />
          <Link href='/news/discover' className='hover:text-primary'>
            News
          </Link>
          <ChevronRight className='w-4 h-4' />
          <span className='font-semibold truncate text-primary'>
            {newsData.title}
          </span>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12'>
          <div className='lg:col-span-2'>
            <div className='relative w-full overflow-hidden shadow-lg aspect-video md:aspect-[4/3] rounded-xl'>
              <Image
                src={
                  newsData.images?.[0] ||
                  'https://placehold.co/600x400/e0e0e0/000?text=News'
                }
                alt={newsData.title}
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div>

          <div className='lg:col-span-3'>
            <h1 className='text-2xl font-bold text-gray-800 md:text-4xl'>
              {newsData.title}
            </h1>
            <div className='flex flex-col flex-wrap mt-4 text-gray-500 gap-x-6 gap-y-2 sm:flex-row'>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4' />
                <span>{newsData.author?.fullname || 'Admin'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>
                  {newsData.created_at
                    ? format(new Date(newsData.created_at), 'MMMM dd, yyyy')
                    : 'No date provided'}
                </span>
              </div>
            </div>
            <div className='mt-6 space-y-6 text-base leading-relaxed text-gray-700 whitespace-pre-wrap md:text-lg'>
              {(newsData.content || '')
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='flex justify-center py-10 bg-gray-50 md:py-20'>
      <Wrapper>{renderContent()}</Wrapper>
    </div>
  );
}
