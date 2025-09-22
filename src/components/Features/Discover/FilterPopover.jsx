import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Filter as FilterIcon } from 'lucide-react';

// Opsi statis untuk filter baru
const staticFilterOptions = {
  statusMyItems: [
    'Waiting for Request',
    'Waiting for Confirmation',
    'Confirmed',
    'Completed',
    'Failed',
  ],
  statusOthersItems: ['Request Submitted', 'Confirmed', 'Completed', 'Failed'],
  ownership: ['My Items', "Other's Item"],
};

// Menerima 'filters' saat ini, daftar kategori, dan fungsi onApplyFilters
export default function FilterPopover({
  initialFilters,
  categories = [],
  onApplyFilters,
}) {
  // State lokal untuk menampung perubahan sebelum tombol "Apply" diklik
  const [localFilters, setLocalFilters] = useState(initialFilters);

  // Update state lokal jika filter dari parent berubah (misalnya saat reset)
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Fungsi generik untuk menangani perubahan pada checkbox
  const handleCheckboxChange = (group, value, isChecked) => {
    setLocalFilters((prevFilters) => {
      const currentGroupValues = prevFilters[group] || [];
      let newGroupValues;

      if (isChecked) {
        newGroupValues = [...currentGroupValues, value];
      } else {
        newGroupValues = currentGroupValues.filter((item) => item !== value);
      }
      return { ...prevFilters, [group]: newGroupValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      categories: [],
      statusMyItems: [],
      statusOthersItems: [],
      ownership: [],
    };
    setLocalFilters(defaultFilters);
    onApplyFilters(defaultFilters); // Langsung terapkan reset ke parent
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
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {/* Category */}
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Category</h4>
            {categories.map((cat) => (
              <div key={cat.id} className='flex items-center space-x-2'>
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={localFilters.categories.includes(cat.name)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('categories', cat.name, checked)
                  }
                />
                <label htmlFor={`cat-${cat.id}`} className='text-sm'>
                  {cat.name}
                </label>
              </div>
            ))}
          </div>

          {/* Status (My Items) */}
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Status (My Items)</h4>
            {staticFilterOptions.statusMyItems.map((status) => (
              <div key={status} className='flex items-center space-x-2'>
                <Checkbox
                  id={`my-${status}`}
                  checked={localFilters.statusMyItems.includes(status)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('statusMyItems', status, checked)
                  }
                />
                <label htmlFor={`my-${status}`} className='text-sm'>
                  {status}
                </label>
              </div>
            ))}
          </div>

          {/* Status (Other's Items) */}
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              Status (Other{"'"}s Items)
            </h4>
            {staticFilterOptions.statusOthersItems.map((status) => (
              <div key={status} className='flex items-center space-x-2'>
                <Checkbox
                  id={`other-${status}`}
                  checked={localFilters.statusOthersItems.includes(status)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('statusOthersItems', status, checked)
                  }
                />
                <label htmlFor={`other-${status}`} className='text-sm'>
                  {status}
                </label>
              </div>
            ))}
          </div>

          {/* Ownership */}
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Ownership</h4>
            {staticFilterOptions.ownership.map((owner) => (
              <div key={owner} className='flex items-center space-x-2'>
                <Checkbox
                  id={`owner-${owner}`}
                  checked={localFilters.ownership.includes(owner)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('ownership', owner, checked)
                  }
                />
                <label htmlFor={`owner-${owner}`} className='text-sm'>
                  {owner}
                </label>
              </div>
            ))}
          </div>
        </div>
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
