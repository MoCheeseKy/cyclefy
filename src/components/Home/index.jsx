import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

import Wrapper from '../_shared/Wrapper';
import Button from '../_shared/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [latestNews, setLatestNews] = useState([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsNewsLoading(true);

      // Mengambil token dari localStorage
      const token = localStorage.getItem('cyclefy_user_token');
      const headers = {};

      // Jika token ada, tambahkan ke header
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/news`,
          {
            headers, // Mengirim header dengan atau tanpa token
            params: {
              page: 1,
              size: 8,
              orderBy: 'newest',
            },
          }
        );
        setLatestNews(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch latest news:', error);
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  return (
    <>
      <div className='flex flex-col items-center py-20'>
        <Wrapper className={'flex flex-col items-center'}>
          {/* Hero Carousel Section */}
          <div className='relative w-full'>
            <Carousel setApi={setApi} className='w-full'>
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className='flex items-center justify-between gap-8 px-24'>
                      <div className='flex flex-col max-w-lg gap-4'>
                        <p className='text-6xl font-bold text-text-primary'>
                          {slide.title}
                        </p>
                        <p className='text-text-subtle'>{slide.description}</p>
                      </div>
                      <div className='relative w-[633px] aspect-[633/480] rounded-xl overflow-hidden bg-gray-200'>
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          layout='fill'
                          objectFit='cover'
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <Button
              onClick={scrollPrev}
              variant='outline'
              className='absolute left-0 top-1/2 h-[70px] w-[70px] -translate-y-1/2 rounded-full bg-white text-primary shadow-lg hover:bg-gray-100'
            >
              <IoIosArrowBack className='text-4xl' />
            </Button>
            <Button
              onClick={scrollNext}
              variant='outline'
              className='absolute right-0 top-1/2 h-[70px] w-[70px] -translate-y-1/2 rounded-full bg-white text-primary shadow-lg hover:bg-gray-100'
            >
              <IoIosArrowForward className='text-4xl' />
            </Button>
          </div>
          <div className='flex items-center justify-center gap-2 mt-8'>
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`cursor-pointer h-2 rounded-full transition-all duration-300 ${
                  current === index ? 'w-4 bg-primary' : 'w-2 bg-stone-300'
                }`}
              />
            ))}
          </div>
        </Wrapper>

        {/* Key Features Section */}
        <Wrapper id={'features'} className={'flex flex-col items-center mt-20'}>
          <p className='font-bold text-[30px] mb-2'>Key Features</p>
          <p className='text-lg'>
            Empowering students to share, borrow, recycle, and repair.
          </p>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-[30px] mt-[30px]'>
            {features?.map((feat, featIndex) => (
              <div
                key={featIndex}
                className='bg-primary/50 h-[310px] w-full rounded-[12px] flex justify-end'
              >
                <div className='bg-primary h-full w-[calc(100%-16px)] rounded-[12px] p-[30px] text-white flex flex-col justify-between'>
                  <div className='flex flex-col gap-[10px]'>
                    <div className='w-[70px] aspect-square rounded-full bg-white' />
                    <p className='text-xl font-bold'>{feat?.name}</p>
                    <p className='text-sm '>{feat?.description}</p>
                  </div>
                  <Button
                    onClick={() => router.push(feat?.href)}
                    className={'w-full bg-white text-black hover:bg-gray-200'}
                  >
                    Go To {feat?.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>

        {/* Latest News Section */}
        <Wrapper id={'news'} className={'flex flex-col items-center mt-20'}>
          <p className='font-bold text-[30px] mb-2'>Latest News</p>
          <p className='max-w-2xl text-lg text-center'>
            Stay updated with the latest articles, tips, and stories from our
            community.
          </p>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[30px] min-h-[300px]'>
            {isNewsLoading ? (
              <div className='flex items-center justify-center col-span-full'>
                <Loader2 className='w-8 h-8 text-gray-400 animate-spin' />
              </div>
            ) : (
              latestNews.map((news) => (
                <Link
                  href={`/news/${news.id}/detail`}
                  key={news.id}
                  legacyBehavior
                >
                  <a className='flex flex-col gap-[10px] group'>
                    <div className='relative bg-gray-200 w-full aspect-square rounded-[12px] overflow-hidden'>
                      <Image
                        src={
                          news.images?.[0] ||
                          'https://dummyimage.com/400x400/e0e0e0/000&text=News'
                        }
                        alt={news.title}
                        layout='fill'
                        objectFit='cover'
                        className='transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>
                    <p className='text-lg font-semibold line-clamp-2 group-hover:text-primary'>
                      {news.title}
                    </p>
                    <p className='text-xs font-light text-gray-500'>
                      by {news.author?.fullname || 'Admin'} •{' '}
                      {format(new Date(news.created_at), 'MMMM dd, yyyy')}
                    </p>
                  </a>
                </Link>
              ))
            )}
          </div>
          <Button
            onClick={() => router.push('/news/discover')}
            className={'mt-4 text-white'}
            text={'View All News'}
            endIcon={<IoIosArrowForward />}
          />
        </Wrapper>

        {/* About Us Section */}
        <Wrapper
          id={'about-us'}
          className={
            'flex flex-col md:flex-row gap-12 lg:gap-24 items-center mt-20'
          }
        >
          <div className='relative w-full md:min-w-[514px] h-[462px] rounded-xl overflow-hidden bg-gray-200'>
            <Image
              src='https://images.unsplash.com/photo-1532629345422-7515f3d16bb6'
              alt='About Cyclefy'
              layout='fill'
              objectFit='cover'
            />
          </div>
          <div className='flex flex-col gap-[30px]'>
            <p className='text-[30px] font-bold'>About Cyclefy</p>
            <p className='text-base text-gray-600'>
              Cyclefy is a campus-based initiative designed to foster a culture
              of sustainability among students. We provide a platform for
              donating, bartering, borrowing, recycling, and repairing items,
              reducing waste and promoting a circular economy within the campus
              community.
            </p>
            <p className='text-base text-gray-600'>
              Our mission is to empower students to make conscious choices,
              extend the life of products, and create a more sustainable and
              collaborative environment for everyone.
            </p>
          </div>
        </Wrapper>
      </div>
    </>
  );
}

const features = [
  {
    name: 'Donation',
    href: '/features/donation',
    description:
      'Give your unused items a new life by donating them to fellow students in need.',
  },
  {
    name: 'Barter',
    href: '/features/barter',
    description:
      'Exchange your items with others in a simple, cashless transaction system.',
  },
  {
    name: 'Borrowing',
    href: '/features/borrowing',
    description:
      'Need something for a short time? Borrow items from others instead of buying new.',
  },
  {
    name: 'Recycling & Repair',
    href: '/features/recycling-repair',
    description:
      'Find locations to recycle your goods or get them repaired to extend their lifespan.',
  },
];
const heroSlides = [
  {
    title: 'Share More, Waste Less',
    description:
      'Join a community of students making a difference. Easily donate, barter, or borrow items to promote sustainability on campus.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433',
  },
  {
    title: 'Give Items a Second Chance',
    description:
      'Your pre-loved books, clothes, and electronics can find a new home. Our platform makes it easy to connect with others who need them.',
    imageUrl: 'https://images.unsplash.com/photo-1615464884358-2936f616082a',
  },
  {
    title: 'Smart, Sustainable Campus Life',
    description:
      'Access what you need without the waste. From borrowing tools for a project to bartering for goods, live smarter and more sustainably.',
    imageUrl: 'https://images.unsplash.com/photo-1542601904-82a1756411e2',
  },
];
