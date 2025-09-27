import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NewsCard({ news }) {
  const imageUrl =
    news.images?.[0] || 'https://dummyimage.com/400x400/e0e0e0/000&text=News';

  return (
    <Link href={`/news/${news.id}/detail`} legacyBehavior>
      <a className='flex flex-col gap-[10px] group'>
        <div className='relative w-full overflow-hidden aspect-square rounded-xl'>
          <Image
            src={imageUrl}
            alt={news.title}
            layout='fill'
            objectFit='cover'
            className='transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <h3 className='text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-primary'>
          {news.title}
        </h3>
        <p className='text-xs font-light text-gray-500'>
          by {news.author?.fullname || 'Unknown Author'} •{' '}
          {format(new Date(news.created_at), 'MMMM dd, yyyy')}
        </p>
      </a>
    </Link>
  );
}
