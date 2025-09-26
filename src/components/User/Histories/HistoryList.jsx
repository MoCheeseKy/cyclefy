import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import HistoryCard from './HistoryCard';
import DonationFilterPopover from './DonationFilterPopover';
import BarterFilterPopover from './BarterFilterPopover';
import BorrowingFilterPopover from './BorrowingFilterPopover';
import RepairFilterPopover from './RepairFilterPopover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

export default function HistoryList({ historyType, endpoint }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('cyclefy_user_token');
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllCategories(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories for filter:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');
    let params;

    if (historyType === 'barter' || historyType === 'borrow') {
      params = {
        userItemPage: currentPage,
        otherItemPage: currentPage,
        userItemSize: 5,
        otherItemSize: 5,
        search: searchTerm || undefined,
        ...filters,
      };
    } else {
      params = {
        page: currentPage,
        size: 10,
        search: searchTerm || undefined,
        ...filters,
      };
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (historyType === 'barter' || historyType === 'borrow') {
        const myItems = response.data.data.my_items || [];
        const otherItems = response.data.data.other_items || [];
        const combinedItems = [...myItems, ...otherItems];
        setItems(combinedItems);

        const myMeta = response.data.meta.my_items;
        const otherMeta = response.data.meta.other_items;
        const totalPages = Math.max(
          myMeta?.totalPages || 1,
          otherMeta?.totalPages || 1
        );
        setMeta({ page: currentPage, totalPages });
      } else {
        setItems(response.data.data || []);
        setMeta(response.data.meta || { page: 1, totalPages: 1 });
      }
    } catch (error) {
      console.error(`Failed to fetch ${historyType}:`, error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load History',
        description: 'Could not fetch data from the server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, currentPage, searchTerm, filters, historyType, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(inputValue);
  };

  const applyFilters = (newFilters) => {
    setCurrentPage(1);
    const formattedFilters = {};
    for (const key in newFilters) {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        formattedFilters[key] = newFilters[key].join(',');
      }
    }
    setFilters(formattedFilters);
  };

  const renderFilterPopover = () => {
    switch (historyType) {
      case 'donation':
      case 'recycle':
        return (
          <DonationFilterPopover
            onApplyFilters={applyFilters}
            categories={allCategories}
          />
        );
      case 'barter':
        return (
          <BarterFilterPopover
            onApplyFilters={applyFilters}
            categories={allCategories}
          />
        );
      case 'borrow':
        return (
          <BorrowingFilterPopover
            onApplyFilters={applyFilters}
            categories={allCategories}
          />
        );
      case 'repair':
        return (
          <RepairFilterPopover
            onApplyFilters={applyFilters}
            categories={allCategories}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='flex items-center flex-grow'>
          <Input
            type='text'
            placeholder={`Search your ${historyType} history...`}
            className='rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} className='rounded-l-none'>
            <Search className='w-4 h-4' />
          </Button>
        </div>
        {renderFilterPopover()}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='w-8 h-8 text-gray-500 animate-spin' />
        </div>
      ) : items.length > 0 ? (
        <div className='space-y-4'>
          {items.map((item) => (
            <HistoryCard
              key={`${historyType}-${item.id}`}
              item={item}
              type={historyType}
            />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-64 bg-white border rounded-lg'>
          <p className='text-gray-500'>No history found.</p>
        </div>
      )}

      {!isLoading && meta.totalPages > 1 && (
        <div className='flex items-center justify-center gap-4 mt-4'>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant='outline'
          >
            Previous
          </Button>
          <span className='text-sm font-medium'>
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
            }
            disabled={currentPage === meta.totalPages}
            variant='outline'
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
