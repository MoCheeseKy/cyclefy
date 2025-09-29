// components/Footer.jsx

import Wrapper from '@/components/_shared/Wrapper';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPin, Phone, Mail } from 'lucide-react';

function ContactUs() {
  return (
    <div className='pt-16 bg-primary'>
      <Wrapper>
        <div className='relative bg-primary rounded-t-3xl lg:rounded-t-[50px] overflow-hidden'>
          <div className='absolute inset-0 bg-primary'></div>
          <div className='relative z-10 flex flex-col items-center gap-6 px-4 py-16 text-center text-background'>
            <h2 className='text-4xl font-bold'>Contact Us</h2>
            <p className='text-lg text-background/80'>
              Have questions or need help? Get in touch with us!
            </p>

            <div className='w-full max-w-4xl p-6 mt-6 text-left text-gray-800 bg-white shadow-lg rounded-2xl md:p-10'>
              <div className='mb-8 overflow-hidden rounded-xl'>
                <div className='flex items-center justify-center w-full h-64 text-gray-500 bg-gray-200'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4873.0733562907735!2d107.6255820758765!3d-6.969276668241866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9bc3974981d%3A0x613eec0feec9fcf7!2sTelkom%20University%20Landmark%20Tower%20(TULT)!5e1!3m2!1sid!2sid!4v1759161455550!5m2!1sid!2sid'
                    width='100%'
                    height='100%'
                    allowfullscreen=''
                    loading='lazy'
                    referrerpolicy='no-referrer-when-downgrade'
                  ></iframe>
                </div>
              </div>

              <div className='flex flex-col gap-6 text-base'>
                <div className='flex items-center gap-4'>
                  <MapPin className='w-6 h-6 text-red-600' />
                  <span>Jl. Lorem Ipsum No. 123</span>
                </div>
                <div className='flex items-center gap-4'>
                  <Phone className='w-6 h-6 text-red-600' />
                  <span>+6281234567890</span>
                </div>
                <div className='flex items-center gap-4'>
                  <Mail className='w-6 h-6 text-red-600' />
                  <span>cyclefy@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

export default function Footer() {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <>
      <footer
        className={`flex justify-center py-16 text-background bg-primary ${
          isHomePage && 'rounded-tl-[150px] rounded-tr-[150px]'
        }`}
      >
        <Wrapper className='flex flex-col gap-12'>
          {isHomePage && <ContactUs />}
          <div className='flex flex-col justify-between gap-10 lg:flex-row'>
            <div className='max-w-xs'>
              <Link href='/' className='flex items-center gap-3 mb-4'>
                <div className='bg-logo bg-no-repeat bg-cover w-[276px] aspect-[135/40]'></div>
              </Link>
              <p className='text-sm text-background/70'>
                Empowering students to share, borrow, recycle, and create a more
                sustainable campus life.
              </p>
            </div>

            <div className='grid w-full grid-cols-2 gap-10 text-sm md:grid-cols-3 lg:w-auto'>
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
                    aria-label='Google'
                    className='flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200'
                  >
                    G
                  </a>
                  <a
                    href='#'
                    aria-label='Facebook'
                    className='flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200'
                  >
                    f
                  </a>
                  <a
                    href='#'
                    aria-label='Twitter/X'
                    className='flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200'
                  >
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr className='border-background/20' />

          <div className='flex items-center justify-center'>
            <p className='text-sm text-background/70'>
              © {new Date().getFullYear()} Cyclefy. All rights reserved.
            </p>
          </div>
        </Wrapper>
      </footer>
    </>
  );
}
