import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Import komponen UI
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Filter as FilterIcon, CalendarIcon } from 'lucide-react';

// Sub-komponen untuk filter Borrowing (Lengkap)
const BorrowingFilters = ({ localFilters, setLocalFilters, categories }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, fieldName) => {
    setLocalFilters((prev) => ({ ...prev, [fieldName]: date }));
  };

  const handleCategoryChange = (checked, categoryName) => {
    setLocalFilters((prevFilters) => {
      const currentCategories = prevFilters.categories || [];
      const newCategories = checked
        ? [...currentCategories, categoryName]
        : currentCategories.filter((item) => item !== categoryName);
      return { ...prevFilters, categories: newCategories };
    });
  };

  return (
    <div className='grid grid-cols-3 gap-6'>
      {/* Kolom 1: Category */}
      <div className='space-y-2'>
        <h4 className='font-bold'>Category</h4>
        {categories.map((cat) => (
          <div key={cat.id} className='flex items-center space-x-2'>
            <Checkbox
              id={`cat-borrow-${cat.id}`}
              checked={localFilters.categories?.includes(cat.name)}
              onCheckedChange={(checked) =>
                handleCategoryChange(checked, cat.name)
              }
            />
            <Label
              htmlFor={`cat-borrow-${cat.id}`}
              className='text-sm font-normal'
            >
              {cat.name}
            </Label>
          </div>
        ))}
      </div>

      {/* Kolom 2: Borrowing Duration */}
      <div className='space-y-2'>
        <h4 className='font-bold'>Borrowing Duration</h4>
        <div>
          <Label className='text-xs'>From:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={`w-full justify-start text-left font-normal mt-1 ${
                  !localFilters.from && 'text-muted-foreground'
                }`}
              >
                <CalendarIcon className='w-4 h-4 mr-2' />
                {localFilters.from ? (
                  format(localFilters.from, 'dd/MM/yyyy')
                ) : (
                  <span>dd/mm/yyyy</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={localFilters.from}
                onSelect={(date) => handleDateChange(date, 'from')}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className='text-xs'>To:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={`w-full justify-start text-left font-normal mt-1 ${
                  !localFilters.to && 'text-muted-foreground'
                }`}
              >
                <CalendarIcon className='w-4 h-4 mr-2' />
                {localFilters.to ? (
                  format(localFilters.to, 'dd/MM/yyyy')
                ) : (
                  <span>dd/mm/yyyy</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={localFilters.to}
                onSelect={(date) => handleDateChange(date, 'to')}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='text-xs text-center'>OR</div>
        <div>
          <Label className='text-xs'>Number of Days:</Label>
          <Input
            name='days'
            placeholder='e.g., 7'
            value={localFilters.days || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Kolom 3: Location */}
      <div className='space-y-2'>
        <h4 className='font-bold'>Location</h4>
        <div>
          <Label className='text-xs'>Maximum Distance:</Label>
          <Input
            name='maxDistance'
            placeholder='e.g., 5 (in km)'
            value={localFilters.maxDistance || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='text-xs text-center'>OR</div>
        <div>
          <Label className='text-xs'>Enter Location:</Label>
          <Input
            name='location'
            placeholder='e.g., Bandung'
            value={localFilters.location || ''}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-komponen untuk filter Barter (Hanya Kategori)
const BarterFilters = ({ localFilters, setLocalFilters, categories }) => {
  const handleCategoryChange = (checked, categoryName) => {
    setLocalFilters((prevFilters) => {
      const currentCategories = prevFilters.categories || [];
      const newCategories = checked
        ? [...currentCategories, categoryName]
        : currentCategories.filter((item) => item !== categoryName);
      return { ...prevFilters, categories: newCategories };
    });
  };

  return (
    <div className='grid grid-cols-1 w-[200px]'>
      <div className='space-y-2'>
        <h4 className='font-bold'>Category</h4>
        {categories.map((cat) => (
          <div key={cat.id} className='flex items-center space-x-2'>
            <Checkbox
              id={`cat-barter-${cat.id}`}
              checked={localFilters.categories?.includes(cat.name)}
              onCheckedChange={(checked) =>
                handleCategoryChange(checked, cat.name)
              }
            />
            <Label
              htmlFor={`cat-barter-${cat.id}`}
              className='text-sm font-normal'
            >
              {cat.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FilterPopover({
  discover_type,
  initialFilters,
  categories = [],
  onApplyFilters,
}) {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      categories: [],
      maxDistance: '',
      location: '',
      from: undefined,
      to: undefined,
      days: '',
    };
    setLocalFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='text-white bg-green-800 hover:bg-green-700 hover:text-white'
        >
          Filters
          <FilterIcon className='w-4 h-4 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-6' align='end'>
        {discover_type === 'borrowing' ? (
          <BorrowingFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            categories={categories}
          />
        ) : (
          <BarterFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            categories={categories}
          />
        )}

        <div className='flex justify-end gap-4 mt-6'>
          <Button variant='ghost' onClick={handleReset}>
            Reset Filters
          </Button>
          <Button
            className='bg-green-800 hover:bg-green-700'
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
