// components/recycle/FilterPopover.js

import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

const defaultFilters = {
  categories: [],
  maxDistance: '',
  location: '',
};

export default function FilterPopover({
  initialFilters,
  categories,
  onApplyFilters,
}) {
  const [localFilters, setLocalFilters] = useState(
    initialFilters || defaultFilters
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleCheckboxChange = (categoryName, checked) => {
    setLocalFilters((prev) => {
      const newCategories = checked
        ? [...prev.categories, categoryName]
        : prev.categories.filter((c) => c !== categoryName);
      return { ...prev, categories: newCategories };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='text-white bg-green-800 hover:bg-green-700 hover:text-white'
        >
          <Filter className='w-4 h-4 mr-2' />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Filter Options</h4>
            <p className='text-sm text-muted-foreground'>
              Refine your search results.
            </p>
          </div>
          <div className='grid gap-2'>
            {/* Category Filter */}
            <div className='mb-2'>
              <Label className='font-semibold'>Category</Label>
              <div className='mt-2 space-y-2 overflow-y-auto max-h-40'>
                {categories.map((cat) => (
                  <div key={cat.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={localFilters.categories.includes(cat.name)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(cat.name, checked)
                      }
                    />
                    <Label htmlFor={`cat-${cat.id}`}>{cat.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className='mb-2'>
              <Label htmlFor='maxDistance' className='font-semibold'>
                Location
              </Label>
              <Input
                id='maxDistance'
                placeholder='Maximum Distance (km)'
                type='number'
                value={localFilters.maxDistance}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxDistance: e.target.value,
                    location: '',
                  })
                }
                className='mt-2'
              />
              <div className='relative my-2'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='px-2 bg-popover text-muted-foreground'>
                    OR
                  </span>
                </div>
              </div>
              <Input
                id='location'
                placeholder='Enter Location'
                value={localFilters.location}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    location: e.target.value,
                    maxDistance: '',
                  })
                }
                disabled={!!localFilters.maxDistance}
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <Button variant='ghost' onClick={handleReset}>
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className='bg-green-800 hover:bg-green-700'
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
