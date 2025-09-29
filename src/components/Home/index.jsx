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
  const [bgIndex, setBgIndex] = useState(0);
  const [latestNews, setLatestNews] = useState([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsNewsLoading(true);
      const token = localStorage.getItem('cyclefy_user_token');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/news`,
          {
            headers,
            params: { page: 1, size: 8, orderBy: 'newest' },
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setBgIndex(current);
    }, 1000);
    return () => clearTimeout(timer);
  }, [current]);

  const scrollPrev = () => api?.scrollPrev();
  const scrollNext = () => api?.scrollNext();

  const heroBackgrounds = [
    'bg-hero-background-1',
    'bg-hero-background-2',
    'bg-hero-background-3',
  ];

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-[calc(100vh-88px)] bg-cover bg-center bg-no-repeat transition-all duration-500 ${heroBackgrounds[bgIndex]}`}
      >
        <Wrapper className={'flex flex-col'}>
          <div className='relative flex'>
            <Carousel setApi={setApi} className='flex w-full'>
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className='flex flex-col items-center justify-center gap-8 text-center md:flex-row md:justify-between md:text-left md:px-[100px]'>
                      <div className='flex flex-col order-2 w-full max-w-lg gap-4 md:order-1'>
                        <p className='text-4xl font-bold md:text-6xl text-text-primary'>
                          {slide.title}
                        </p>
                        <p className='text-text-subtle'>{slide.description}</p>
                      </div>
                      <div
                        className={`relative w-full max-w-sm md:max-w-none md:min-w-[595px] aspect-[633/480] rounded-xl overflow-hidden bg-cover bg-no-repeat order-1 md:order-2
                        ${index === 0 ? 'bg-hero-image-1' : ''}
                        ${index === 1 ? 'bg-hero-image-2' : ''}
                        ${index === 2 ? 'bg-hero-image-3' : ''}
                        `}
                      ></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <Button
              onClick={scrollPrev}
              variant='outline'
              className='absolute left-0 top-1/2 h-[70px] w-[70px] -translate-y-1/2 rounded-full bg-white text-primary shadow-lg hover:bg-gray-100 hidden md:flex'
            >
              <IoIosArrowBack className='text-4xl' />
            </Button>
            <Button
              onClick={scrollNext}
              variant='outline'
              className='absolute right-0 top-1/2 h-[70px] w-[70px] -translate-y-1/2 rounded-full bg-white text-primary shadow-lg hover:bg-gray-100 hidden md:flex'
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
      </div>

      <div className='flex flex-col items-center py-10 md:py-20'>
        <Wrapper id={'features'} className={'flex flex-col items-center'}>
          <p className='text-2xl font-bold md:text-[30px] mb-2'>Key Features</p>
          <p className='text-base text-center md:text-lg'>
            Empowering students to share, borrow, recycle, and repair.
          </p>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[30px] mt-8 md:mt-[30px]'>
            {features?.map((feat, featIndex) => (
              <div
                key={featIndex}
                className='bg-primary h-fit w-full rounded-[12px] flex justify-end'
              >
                <div className='bg-secondary h-full w-[calc(100%-12px)] md:w-[calc(100%-16px)] rounded-[12px] p-6 md:p-[30px] text-white flex flex-col justify-between'>
                  <div className='flex flex-col gap-[10px]'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`w-[60px] md:w-[70px] aspect-square rounded-full bg-cover bg-no-repeat 
                        ${feat?.name === 'Donation' ? 'bg-donation-logo' : ''}
                        ${feat?.name === 'Barter' ? 'bg-barter-logo' : ''}
                        ${feat?.name === 'Borrowing' ? 'bg-borrowing-logo' : ''}
                        ${
                          feat?.name === 'Recycling & Repair'
                            ? 'bg-recycle-repair-logo'
                            : ''
                        }
                        `}
                      />
                      <p className='text-xl font-bold'>{feat?.name}</p>
                    </div>
                    <p className='text-sm'>{feat?.description}</p>
                  </div>
                  <div className='flex justify-center w-full'>
                    <Button
                      onClick={() => router.push(feat?.href)}
                      className={
                        'w-full max-w-[290px] bg-white text-black hover:bg-gray-200 rounded-[16px] mt-8 md:mt-[62px]'
                      }
                    >
                      Go To {feat?.name}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>

        <Wrapper id={'news'} className={'flex flex-col items-center mt-20'}>
          <p className='text-2xl font-bold md:text-[30px] mb-2'>Latest News</p>
          <p className='max-w-2xl text-base text-center md:text-lg'>
            Stay updated with the latest articles, tips, and stories from our
            community.
          </p>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mt-[30px] min-h-[300px]'>
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
      </div>
      <div className='flex flex-col items-center pt-10 pb-20 bg-no-repeat bg-cover md:pt-20 md:pb-40 bg-block-background'>
        <Wrapper
          id={'about-us'}
          className={
            'flex flex-col md:flex-row gap-12 lg:gap-[30px] items-center'
          }
        >
          <div className='relative w-full h-80 md:min-w-[514px] md:h-[462px] rounded-xl overflow-hidden bg-about-us-image bg-cover bg-center bg-no-repeat'></div>
          <div className='flex flex-col gap-6 md:gap-[30px]'>
            <p className='text-2xl font-bold md:text-[30px]'>About Cyclefy</p>
            <p className='text-base text-gray-600'>
              Cyclefy is a website-based digital platform designed to foster the
              circular economy within the student community. Through a range of
              services including donations, bartering, borrowing, recycling, and
              item repairs, Cyclefy encourages students to reduce waste, share
              resources, and make the most of items that are still in good
              condition.
            </p>
            <p className='text-base text-gray-600'>
              The platform aims to create a sustainable ecosystem where students
              can easily exchange, reuse, and repair goods, minimizing the need
              for new purchases and promoting a more responsible consumption
              model.
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
      'Donate unused items to others who can benefit from them, reducing waste and supporting the community.',
  },
  {
    name: 'Barter',
    href: '/features/barter',
    description:
      'Swap items you no longer need with others, creating a sustainable way to exchange resources.',
  },
  {
    name: 'Borrowing',
    href: '/features/borrowing',
    description:
      'Borrow or lend items with others, helping reduce waste and promoting a sharing economy among students.',
  },
  {
    name: 'Recycling & Repair',
    href: '/features/recycling-repair',
    description:
      'Recycle old items and repair what can be reused, contributing to a circular economy and reducing waste.',
  },
];

const heroSlides = [
  {
    title: 'Welcome to Cyclefy!',
    description:
      'Join a community of students making a difference. Easily donate, barter, or borrow items to promote sustainability on campus.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433',
  },
  {
    title: 'Every Step Counts',
    description:
      'Take action to reduce waste and protect the environment with Cyclefy.',
    imageUrl: 'https://images.unsplash.com/photo-1615464884358-2936f616082a',
  },
  {
    title: 'Empower Your Future',
    description:
      'By making sustainable choices today, you’re shaping a better tomorrow.',
    imageUrl: 'https://images.unsplash.com/photo-1542601904-82a1756411e2',
  },
];
