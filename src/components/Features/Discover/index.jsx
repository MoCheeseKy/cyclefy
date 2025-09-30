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
import { ChevronRight, ArrowUpDown, Loader2, Search } from 'lucide-react';

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
    if (router.isReady) {
      fetchCategories();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [fetchData, router.isReady]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(inputValue);
  };

  const applyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const renderPaginationItems = () => {
    const total = meta.totalPages;
    const current = page;
    const pages = [];
    const range = 2;

    if (total <= 1) return null;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > range + 1) pages.push('...');
      for (
        let i = Math.max(2, current - range);
        i <= Math.min(total - 1, current + range);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - range) pages.push('...');
      pages.push(total);
    }

    return pages.map((p, index) => (
      <PaginationItem key={`${p}-${index}`}>
        {p === '...' ? (
          <span className='px-4 py-2'>...</span>
        ) : (
          <PaginationLink
            href='#'
            isActive={page === p}
            onClick={(e) => {
              e.preventDefault();
              setPage(p);
            }}
          >
            {p}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };

  return (
    <div className='flex justify-center py-10 bg-[#F8F9FA] md:py-20'>
      <Wrapper>
        <div className='flex flex-wrap items-center gap-2 text-sm font-medium md:text-base'>
          <Link href='/' className='text-text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link href='/' className='text-text-primary'>
            Key Features
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <Link
            href={`/features/${discover_type}`}
            className='text-text-primary'
          >
            {PostType}
          </Link>
          <ChevronRight className='w-4 h-4 text-text-primary' />
          <span className='font-bold text-tertiary'>Search for Items</span>
        </div>
        <div className='flex items-center gap-4 my-6'>
          <div
            className={`w-12 h-12 md:w-16 md:h-16 bg-cover bg-center rounded-full ${
              discover_type === 'barter'
                ? 'bg-barter-logo'
                : 'bg-borrowing-logo'
            }`}
          />
          <h1 className='text-2xl font-bold md:text-3xl'>
            Search Item for {PostType}
          </h1>
        </div>
        <p className='text-base text-gray-600 md:text-lg'>{PostDescription}</p>

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
                className='rounded-l-none bg-primary hover:bg-primary/90'
              >
                <Search className='w-4 h-4' />
              </Button>
            </div>
            <div className='flex flex-col gap-4 sm:flex-row'>
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
                <SelectTrigger className='w-full text-white sm:w-auto bg-primary'>
                  <ArrowUpDown className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  {discover_type === 'borrowing' && (
                    <SelectItem value='nearest'>Nearest</SelectItem>
                  )}
                  {discover_type === 'borrowing' && (
                    <SelectItem value='borrowing_duration'>
                      Borrowing Duration
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 min-h-[300px]'>
          {isLoading ? (
            <div className='flex items-center justify-center col-span-full'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                discover_type={discover_type}
              />
            ))
          ) : (
            <div className='py-10 text-center text-gray-500 col-span-full'>
              No items found for the current criteria.
            </div>
          )}
        </div>

        {!isLoading && meta.totalPages > 1 && (
          <div className='mt-10'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(meta.totalPages, p + 1));
                    }}
                    disabled={page === meta.totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Wrapper>
    </div>
  );
}
