import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';

import Wrapper from '@/components/_shared/Wrapper';
import ItemCard from './ItemCard';
import FilterPopover from './FilterPopover';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight, ArrowUpDown } from 'lucide-react';

const defaultFilters = {
  categories: [],
  maxDistance: '',
  location: '',
  from: undefined,
  to: undefined,
  days: '',
};

export default function Discover() {
  const router = useRouter();
  const { discover_type } = router.query;

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, size: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [PostType, setPostType] = useState('...');
  const [PostDescription, setPostDescription] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (discover_type === 'borrowing') {
      setPostType('Borrow');
      setPostDescription(
        'Browse available items for borrow and find something you need...'
      );
    } else if (discover_type === 'barter') {
      setPostType('Barter');
      setPostDescription(
        'Find items you need by browsing through other people’s offerings for barter...'
      );
    }
  }, [discover_type]);

  const fetchData = useCallback(async () => {
    if (!discover_type) return;
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');
    const endpoint = discover_type === 'borrowing' ? '/borrows' : '/barters';
    const baseUrl = process.env.NEXT_PUBLIC_HOST;

    let params = {
      page,
      size: 10,
      search: searchTerm || undefined,
      sortBy,
      category: filters.categories.join(',') || undefined,
    };

    if (discover_type === 'borrowing') {
      params = {
        ...params,
        maxDistance: filters.maxDistance || undefined,
        location: filters.maxDistance
          ? undefined
          : filters.location || undefined,
        from: filters.from ? format(filters.from, 'yyyy-MM-dd') : undefined,
        to: filters.to ? format(filters.to, 'yyyy-MM-dd') : undefined,
        days:
          filters.from || filters.to ? undefined : filters.days || undefined,
      };
    }
    // Untuk 'barter', 'params' dasar sudah cukup.

    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (response.data.success) {
        setItems(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [discover_type, page, searchTerm, sortBy, filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('cyclefy_user_token');
      const baseUrl = process.env.NEXT_PUBLIC_HOST;
      try {
        const response = await axios.get(`${baseUrl}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(inputValue);
  };

  const applyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  return (
    <div className='flex justify-center py-20 bg-[#F8F9FA]'>
      <Wrapper>
        {/* Breadcrumbs dan Header */}
        <div className='flex items-center gap-2 text-base font-medium'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link href='/' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='text-text-primary' />
          <Link
            href={`/features/${discover_type}`}
            className='text-text-primary'
          >
            {PostType}
          </Link>
          <ChevronRight className='text-secondary' />
          <Link href='/' className='text-secondary'>
            Search for Items to {PostType}
          </Link>
        </div>
        <div className='flex my-[10px] items-center gap-[10px]'>
          <div className='w-[60px] h-[60px] bg-gray-200 rounded-full' />
          <p className='text-[30px] font-bold'>Search Item for {PostType}</p>
        </div>
        <p className='text-lg '>{PostDescription}</p>

        {/* Kontrol Search dan Filter */}
        <div className='mt-8'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <div className='flex items-center flex-grow'>
              <Input
                type='text'
                placeholder='Search by item name or description...'
                className='rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                className='bg-green-800 rounded-l-none hover:bg-green-700'
              >
                Search
              </Button>
            </div>
            <div className='flex gap-4'>
              <FilterPopover
                discover_type={discover_type}
                initialFilters={filters}
                categories={categories}
                onApplyFilters={applyFilters}
              />
              <Select
                onValueChange={(value) => {
                  setSortBy(value);
                  setPage(1);
                }}
                defaultValue={sortBy}
              >
                <SelectTrigger className='w-[220px] bg-green-800 text-white'>
                  <ArrowUpDown className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  <SelectItem value='nearest'>Nearest</SelectItem>
                  <SelectItem value='borrowing_duration'>
                    Borrowing Duration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid Item */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 min-h-[300px]'>
            {isLoading ? (
              <p className='col-span-full'>Loading...</p>
            ) : items.length > 0 ? (
              items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  discover_type={discover_type}
                />
              ))
            ) : (
              <p className='col-span-full'>No items found.</p>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && meta.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {[...Array(meta.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href='#'
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(meta.totalPages, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
