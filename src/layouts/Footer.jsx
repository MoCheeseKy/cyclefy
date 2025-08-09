// components/Footer.jsx

import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className='flex justify-center py-16 text-background bg-primary'>
        <Wrapper className='flex flex-col gap-12'>
          <div className='flex flex-col justify-between gap-10 lg:flex-row'>
            <div className='max-w-xs'>
              <Link href='/' className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-12 h-12 bg-white'></div>
                <p className='text-3xl font-bold text-background'>Cyclefy</p>
              </Link>
              <p className='text-sm text-background/70'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className='grid w-full grid-cols-2 gap-16 text-sm md:grid-cols-3 lg:w-auto'>
              <div>
                <h3 className='mb-4 font-semibold text-background'>Features</h3>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      href='/features/donation'
                      className='text-background/70 hover:text-background'
                    >
                      Donation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/features/barter'
                      className='text-background/70 hover:text-background'
                    >
                      Barter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/features/recycling-repair'
                      className='text-background/70 hover:text-background'
                    >
                      Recycling & Repair
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/features/borrowing'
                      className='text-background/70 hover:text-background'
                    >
                      Borrowing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/features/courier'
                      className='text-background/70 hover:text-background'
                    >
                      Courier Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/features/points'
                      className='text-background/70 hover:text-background'
                    >
                      Cyclefy Points
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='mb-4 font-semibold text-background'>
                  Customer Service
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <Link
                      href='/contact-us'
                      className='text-background/70 hover:text-background'
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/faq'
                      className='text-background/70 hover:text-background'
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/legal/terms'
                      className='text-background/70 hover:text-background'
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/legal/privacy'
                      className='text-background/70 hover:text-background'
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='mb-4 font-semibold text-background'>
                  Follow Us
                </h3>
                <div className='flex items-center gap-3'>
                  <a
                    href='#'
                    aria-label='Social Media 1'
                    className='w-8 h-8 rounded-full bg-background/20 hover:bg-background/40'
                  ></a>
                  <a
                    href='#'
                    aria-label='Social Media 2'
                    className='w-8 h-8 rounded-full bg-background/20 hover:bg-background/40'
                  ></a>
                  <a
                    href='#'
                    aria-label='Social Media 3'
                    className='w-8 h-8 rounded-full bg-background/20 hover:bg-background/40'
                  ></a>
                </div>
              </div>
            </div>
          </div>

          <hr className='border-background/20' />

          <div className='flex items-center justify-center'>
            <p className='text-sm text-background/70'>
              © 2025 Cyclefy. All rights reserved.
            </p>
          </div>
        </Wrapper>
      </footer>
    </>
  );
}
