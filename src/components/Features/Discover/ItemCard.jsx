import { Card, CardContent } from '@/components/ui/card';
import { MapPin, User } from 'lucide-react';
// import Image from 'next/image'; // <-- Hapus impor ini

export default function ItemCard({ item }) {
  const imageUrl =
    item?.images && item?.images.length > 0
      ? item?.images[0]
      : 'https://placehold.co/300x200/e2e8f0/e2e8f0?text=No+Image';

  return (
    <Card className='overflow-hidden transition-shadow duration-300 shadow-md hover:shadow-lg'>
      <CardContent className='p-4'>
        <div
          className='w-full aspect-[243/198] mb-4 bg-center bg-cover rounded-md'
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>

        <h3 className='text-lg font-bold truncate'>{item?.item_name}</h3>
        <p className='mb-2 text-sm text-gray-500'>
          {item?.category?.name || 'Uncategorized'}
        </p>
        <p className='h-10 overflow-hidden text-sm text-gray-600 text-ellipsis'>
          {item?.description}
        </p>
        <div className='flex items-center justify-between mt-4 text-xs text-gray-500'>
          <div className='flex items-center gap-1'>
            <MapPin size={14} className='text-red-500' />
            <span>
              {item?.distance ? `${item?.distance.toFixed(1)} km` : '-'}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <User size={14} />
            <span>{item?.user?.username || 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
