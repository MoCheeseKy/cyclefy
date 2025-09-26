import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

const statuses = [
  { name: 'Submitted', value: 'submitted' },
  { name: 'Confirmed', value: 'confirmed' },
  { name: 'Completed', value: 'completed' },
  { name: 'Failed', value: 'failed' },
];

const defaultFilters = { category: [], status: [] };

export default function DonationFilterPopover({ onApplyFilters, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(defaultFilters);

  const handleCheckboxChange = (filterType, value, checked) => {
    setLocalFilters((prev) => {
      const newValues = checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((v) => v !== value);
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };
  const handleReset = () => {
    setLocalFilters(defaultFilters);
    onApplyFilters({});
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='bg-white'>
          <Filter className='w-4 h-4 mr-2' />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <h4 className='font-medium leading-none'>Filter Options</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='font-semibold'>Category</Label>
              <div className='mt-2 space-y-2'>
                {categories.map((cat) => (
                  <div key={cat.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`cat-${cat.name}`}
                      checked={localFilters.category.includes(cat.name)}
                      onCheckedChange={(c) =>
                        handleCheckboxChange('category', cat.name, c)
                      }
                    />
                    <Label htmlFor={`cat-${cat.name}`}>{cat.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className='font-semibold'>Status</Label>
              <div className='mt-2 space-y-2'>
                {statuses.map((stat) => (
                  <div key={stat.value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`stat-${stat.value}`}
                      checked={localFilters.status.includes(stat.value)}
                      onCheckedChange={(c) =>
                        handleCheckboxChange('status', stat.value, c)
                      }
                    />
                    <Label htmlFor={`stat-${stat.value}`}>{stat.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <Button variant='ghost' onClick={handleReset}>
              Reset Filters
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
