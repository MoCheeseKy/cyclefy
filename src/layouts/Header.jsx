import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Bell } from 'lucide-react';

import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';
import ProfileDropdown from './ProfileDropdown';
import LogoutConfirmModal from './LogoutConfirmModal';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    email: '',
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const loadProfileFromLocalStorage = useCallback(() => {
    const token = localStorage.getItem('cyclefy_user_token');
    if (token) {
      setIsLoggedIn(true);
      const userData = localStorage.getItem('cyclefy_user_data');
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setProfile({
            fullName: parsedUserData.fullname || '',
            username: parsedUserData.username || 'User',
            email: parsedUserData.email || '',
            profilePicture: parsedUserData.profile_picture || '',
          });
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
          toast({
            variant: 'destructive',
            title: 'Failed to load profile data',
          });
          setIsLoggedIn(false);
          localStorage.removeItem('cyclefy_user_token');
          localStorage.removeItem('cyclefy_user_data');
        }
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('cyclefy_user_token');
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [toast]);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/users/current/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const hasUnread = response.data.notifications.some(
        (notif) => !notif.is_read
      );
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    loadProfileFromLocalStorage();
    fetchNotifications();
  }, [loadProfileFromLocalStorage, fetchNotifications]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('cyclefy_user_token');
    localStorage.removeItem('cyclefy_user_data');
    setIsLoggedIn(false);
    setHasUnreadNotifications(false);
    setShowLogoutModal(false);
    toast({ title: 'You have been logged out successfully.' });
    router.push('/login');
  };

  return (
    <>
      <header className='flex justify-center py-6 text-white bg-primary'>
        <Wrapper className={'flex justify-between items-center'}>
          <div className='bg-logo bg-no-repeat bg-cover w-[136px] aspect-[135/40]'></div>
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
          <div className='flex items-center gap-4'>
            {isLoggedIn ? (
              <>
                <Link
                  href='/user/notifications'
                  className='relative text-white transition-colors hover:text-gray-200'
                >
                  <Bell size={24} />
                  {hasUnreadNotifications && (
                    <span className='absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-primary' />
                  )}
                </Link>
                <ProfileDropdown
                  profile={profile}
                  onLogoutClick={handleLogout}
                />
              </>
            ) : (
              <Link href={'/login'}>
                <Button
                  className={'bg-white text-black rounded-3xl'}
                  text={'Get Started'}
                />
              </Link>
            )}
            <LanguageSwitcher />
          </div>
        </Wrapper>
      </header>
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={confirmLogout}
      />
    </>
  );
}

function LanguageSwitcher() {
  const [language, setLanguage] = useState('ID');
  const activeTextColor = 'text-background';
  const inactiveTextColor = 'text-text-primary';

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
  { href: '/#features', label: 'Features' },
  { href: '/#news', label: 'News' },
  { href: '/#about-us', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];
