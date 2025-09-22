import { useState } from 'react';

// Import komponen dari Shadcn/UI
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

export default function ExistingItemsForm({
  items = [],
  selectedItemId,
  onSelectionChange,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='p-4 space-y-4 bg-white border rounded-md'>
      <Label className='font-semibold'>Select your item:</Label>
      <div className='relative'>
        <Search className='absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2' />
        <Input
          placeholder='Search your items...'
          className='pl-9'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className='p-2 border rounded-md h-72'>
        <div className='space-y-3'>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                type='button'
                key={item.id}
                onClick={() => onSelectionChange(item.id)}
                className={`w-full p-3 text-left border rounded-lg flex items-center gap-4 transition-all ${
                  selectedItemId === item.id
                    ? 'border-green-600 ring-2 ring-green-300'
                    : 'border-gray-200'
                }`}
              >
                <div
                  className='flex-shrink-0 w-16 h-16 bg-gray-200 bg-center bg-cover rounded-md'
                  style={{ backgroundImage: `url(${item.images[0]})` }}
                ></div>
                <div className='flex-grow'>
                  <div className='flex items-start justify-between'>
                    <p className='font-semibold'>{item.item_name}</p>
                    <span className='px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full'>
                      {item.category.name}
                    </span>
                  </div>
                  <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                    {item.description}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className='text-sm text-center text-gray-500'>No items found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
