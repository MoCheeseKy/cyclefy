import { Card, CardContent } from '@/components/ui/card';
import { MapPin, User } from 'lucide-react';
import Link from 'next/link'; // <-- Impor Link

// Terima prop 'discover_type'
export default function ItemCard({ item, discover_type }) {
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : 'https://placehold.co/300x200/e2e8f0/e2e8f0?text=No+Image';

  return (
    <Link href={`/features/discover/${discover_type}/detail/${item.id}`}>
      <Card className='h-full overflow-hidden transition-shadow duration-300 shadow-md cursor-pointer hover:shadow-lg'>
        <CardContent className='p-4'>
          <div
            className='w-full h-40 mb-4 bg-center bg-cover rounded-md'
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
          <h3 className='text-lg font-bold truncate'>{item.item_name}</h3>
          <p className='mb-2 text-sm text-gray-500'>
            {item.category?.name || 'Uncategorized'}
          </p>
          <p className='h-10 overflow-hidden text-sm text-gray-600 text-ellipsis'>
            {item.description}
          </p>
          <div className='flex items-center justify-between mt-4 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <MapPin size={14} className='text-red-500' />
              <span>
                {item.distance ? `${item.distance.toFixed(1)} km` : '-'}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <User size={14} />
              <span>{item.user?.username || 'Unknown'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
