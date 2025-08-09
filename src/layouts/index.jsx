import Header from './Header';
import Footer from './Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <div className={`flex flex-col min-h-screen ${inter.className}`}>
      <Header />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
}
