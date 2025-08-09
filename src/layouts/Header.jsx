import { useState } from 'react';

import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';

export default function Header() {
  return (
    <>
      <header className='flex justify-center py-6 text-white bg-primary'>
        <Wrapper className={'flex justify-between items-center'}>
          <div className='flex items-center gap-2'>
            <div className='w-10 bg-white aspect-square' />
            <p className='text-2xl font-bold'>Cyclefy</p>
          </div>
          <nav className='hidden lg:flex'>
            <ul className='flex items-center gap-8'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-base font-medium transition-colors text-background/80 hover:text-background'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='flex items-center gap-2'>
            <Button
              className={'bg-white text-black rounded-3xl'}
              text={'Get Started'}
            />
            <LanguageSwitcher />
          </div>
        </Wrapper>
      </header>
    </>
  );
}

function LanguageSwitcher() {
  const [language, setLanguage] = useState('ID');

  const activeTextColor = 'text-background'; // Linen White
  const inactiveTextColor = 'text-text-primary'; // Charcoal Gray

  return (
    <div className='relative flex w-[64px] items-center rounded-full bg-accent-light py-1 bg-white'>
      <div
        className='absolute w-8 transition-transform duration-300 ease-in-out transform rounded-full h-7 bg-status-info'
        style={{
          transform:
            language === 'ID' ? 'translateX(0)' : 'translateX(calc(100% ))',
        }}
      />

      <button
        onClick={() => setLanguage('ID')}
        className={`z-10 flex-1 rounded-full text-center text-sm font-bold transition-colors duration-300 ${
          language === 'ID' ? activeTextColor : inactiveTextColor
        }`}
        aria-pressed={language === 'ID'}
      >
        ID
      </button>

      <button
        onClick={() => setLanguage('EN')}
        className={`z-10 flex-1 rounded-full text-center text-sm font-bold transition-colors duration-300 ${
          language === 'EN' ? activeTextColor : inactiveTextColor
        }`}
        aria-pressed={language === 'EN'}
      >
        EN
      </button>
    </div>
  );
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/news', label: 'News' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];
