import { MapPin } from 'lucide-react';

export default function LocationCard({
  location,
  setPage,
  setSelectedLocationId,
}) {
  const imageUrl =
    location.images?.[0] ||
    'https://placehold.co/600x400/e0e0e0/000?text=No+Image';
  const categoriesText = location.categories.map((cat) => cat.name).join(', ');

  const handleClick = () => {
    setSelectedLocationId(location?.id);
    setPage('location-detail');
  };

  return (
    <div
      onClick={handleClick}
      className='flex flex-col h-full overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer md:flex-row md:h-48 hover:shadow-lg'
    >
      <div className='relative flex-shrink-0 w-full h-40 md:w-2/5 md:h-full'>
        <img
          src={imageUrl}
          alt={location.location_name}
          className='object-cover w-full h-full'
        />
      </div>
      <div className='flex flex-col justify-center w-full p-4 md:w-3/5'>
        <h3 className='text-lg font-bold text-gray-800 line-clamp-1'>
          {location.location_name}
        </h3>
        <p
          className='mb-1 text-sm text-gray-500 line-clamp-1'
          title={categoriesText}
        >
          {categoriesText || 'No categories'}
        </p>
        <p className='mb-2 text-sm text-gray-600 line-clamp-2'>
          {location.address}
        </p>
        {location.distance && (
          <p className='flex items-center gap-1 mt-auto text-sm font-semibold text-gray-700'>
            <MapPin className='w-4 h-4 text-red-500' />
            {parseFloat(location.distance).toFixed(1)} km
          </p>
        )}
      </div>
    </div>
  );
}
