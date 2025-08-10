import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Wrapper from '../_shared/Wrapper';
import Button from '../_shared/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

export default function Home() {
  const router = useRouter();
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
          <div className='relative w-full'>
            <Carousel setApi={setApi} className='w-full'>
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className='flex items-center justify-between gap-8 px-24'>
                      {' '}
                      <div className='flex max-w-[350px] flex-col gap-4'>
                        <p className='text-6xl font-bold text-text-primary'>
                          {slide.title}
                        </p>
                        <p className='text-text-subtle'>{slide.description}</p>
                      </div>
                      <div className='w-[633px] aspect-[633/480] rounded-[12px] bg-[#252525]' />
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

          {/* Paginasi (Dots) */}
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
        <Wrapper id={'features'} className={'flex flex-col items-center mt-20'}>
          <p className='font-bold text-[30px] mb-2'>Key Features</p>
          <p className='text-lg'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className='w-full grid grid-cols-2 gap-[30px] mt-[30px]'>
            {features?.map((feat, featIndex) => (
              <div
                key={featIndex}
                className='bg-primary/50 h-[310px] w-full rounded-[12px] flex justify-end'
              >
                <div className='bg-primary h-[310px] w-[calc(100%-16px)] rounded-[12px] p-[30px] text-white flex flex-col justify-between'>
                  <div className='flex flex-col gap-[10px]'>
                    <div className='w-[70px] aspect-square rounded-full bg-white' />
                    <p className='text-xl font-bold'>{feat?.name}</p>
                    <p className='text-sm '>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push(feat?.href)}
                    className={'w-full bg-white text-black'}
                    text={`Go To ${feat?.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
        <Wrapper id={'news'} className={'flex flex-col items-center mt-20'}>
          <p className='font-bold text-[30px] mb-2'>Latest News</p>
          <p className='text-lg'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className='w-full grid grid-cols-4 gap-[30px] mt-[30px]'>
            {[1, 2, 3, 4, 5, 6, 7, 8]?.map((news, newsIndex) => (
              <div key={newsIndex} className='flex flex-col gap-[10px]'>
                <div className='bg-[#252525] w-full aspect-square rounded-[12px]'></div>
                <p className='text-lg'>Lorrem Ipsum dulu {news}</p>
                <p className='text-xs font-light'>by Lorem • July 15, 2025</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => router.push('/news/discover')}
            className={'mt-4 text-white'}
            text={'View All News'}
            endIcon={<IoIosArrowForward />}
          />
        </Wrapper>
        <Wrapper id={'about-us'} className={'flex gap-24 items-center mt-20'}>
          <div className='min-w-[514px] h-[462px] rounded-[12px] bg-[#252525]' />
          <div className='flex flex-col gap-[30px]'>
            <p className='text-[30px] font-bold'>About Cyclefy</p>
            <p className='text-base'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit.
            </p>
            <p className='text-base'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit.
            </p>
          </div>
        </Wrapper>
      </div>
    </>
  );
}

const features = [
  { name: 'Donation', href: '/features/donation' },
  { name: 'Barter', href: '/features/barter' },
  { name: 'Borrowing', href: '/features/borrowing' },
  { name: 'Recycling & Repair', href: '/features/recycling-repair' },
];
const heroSlides = [
  {
    title: 'Lorem Ipsum 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    imageUrl: '#',
  },
  {
    title: 'Lorem Ipsum 2',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    imageUrl: '#',
  },
  {
    title: 'Lorem Ipsum 3',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    imageUrl: '#',
  },
];
