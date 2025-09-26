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

const userItemStatuses = [
  { name: 'Waiting for Request', value: 'waiting_for_request' },
  { name: 'Waiting for Confirmation', value: 'waiting_for_confirmation' },
  { name: 'Confirmed', value: 'confirmed' },
  { name: 'Lent', value: 'lent' },
  { name: 'Overdue', value: 'overdue' },
  { name: 'Returned', value: 'returned' },
  { name: 'Completed', value: 'completed' },
];
const otherItemStatuses = [
  { name: 'Request Submitted', value: 'request_submitted' },
  { name: 'Confirmed', value: 'confirmed' },
  { name: 'Borrowed', value: 'borrowed' },
  { name: 'Overdue', value: 'overdue' },
  { name: 'Returned', value: 'returned' },
  { name: 'Completed', value: 'completed' },
  { name: 'Failed', value: 'failed' },
];
const ownerships = [
  { name: 'My Items', value: 'my_items' },
  { name: "Other's Requests", value: 'other_requests' },
];

const defaultFilters = {
  category: [],
  userItemStatus: [],
  otherItemStatus: [],
  ownership: [],
};

export default function BorrowingFilterPopover({ onApplyFilters, categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(defaultFilters);

  const handleCheckboxChange = (filterType, value, checked) => {
    setLocalFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
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
      <PopoverContent className='w-[600px]'>
        <div className='grid gap-4'>
          <h4 className='font-medium leading-none'>Filter Options</h4>
          <div className='grid grid-cols-4 gap-4'>
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
              <Label className='font-semibold'>Status (My Items)</Label>
              <div className='mt-2 space-y-2'>
                {userItemStatuses.map((stat) => (
                  <div key={stat.value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`user-stat-${stat.value}`}
                      checked={localFilters.userItemStatus.includes(stat.value)}
                      onCheckedChange={(c) =>
                        handleCheckboxChange('userItemStatus', stat.value, c)
                      }
                    />
                    <Label htmlFor={`user-stat-${stat.value}`}>
                      {stat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className='font-semibold'>Status (Others)</Label>
              <div className='mt-2 space-y-2'>
                {otherItemStatuses.map((stat) => (
                  <div key={stat.value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`other-stat-${stat.value}`}
                      checked={localFilters.otherItemStatus.includes(
                        stat.value
                      )}
                      onCheckedChange={(c) =>
                        handleCheckboxChange('otherItemStatus', stat.value, c)
                      }
                    />
                    <Label htmlFor={`other-stat-${stat.value}`}>
                      {stat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className='font-semibold'>Ownership</Label>
              <div className='mt-2 space-y-2'>
                {ownerships.map((own) => (
                  <div key={own.value} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`own-${own.value}`}
                      checked={localFilters.ownership.includes(own.value)}
                      onCheckedChange={(c) =>
                        handleCheckboxChange('ownership', own.value, c)
                      }
                    />
                    <Label htmlFor={`own-${own.value}`}>{own.name}</Label>
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
