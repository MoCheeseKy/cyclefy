import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Wrapper from '@/components/_shared/Wrapper';
import LocationCard from './LocationCard';
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
import { Search, ArrowUpDown } from 'lucide-react';

const defaultFilters = {
  categories: [],
  maxDistance: '',
  location: '',
};

export default function FindRecyclingLocation({
  setSelectedLocationId,
  setPage,
}) {
  const [locations, setLocations] = useState([]);
  const [meta, setMeta] = useState({ page: 1, size: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const endpoint = '/recycle-locations';
    const params = {
      page: currentPage,
      size: 10,
      search: searchTerm || undefined,
      sortBy,
      category: filters.categories.join(',') || undefined,
      maxDistance: filters.maxDistance || undefined,
      location: filters.maxDistance ? undefined : filters.location || undefined,
    };
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (response.data.success) {
        setLocations(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch recycling locations:', error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, sortBy, filters]);

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
    setCurrentPage(1);
    setSearchTerm(inputValue);
  };

  const applyFilters = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const renderPaginationItems = () => {
    const total = meta.totalPages;
    const current = currentPage;
    const pages = [];
    const range = 2;
    if (total <= 1) return null;
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > range + 1) {
        pages.push('...');
      }
      for (
        let i = Math.max(2, current - range);
        i <= Math.min(total - 1, current + range);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - range) {
        pages.push('...');
      }
      pages.push(total);
    }
    return pages.map((p, index) => (
      <PaginationItem key={`${p}-${index}`}>
        {p === '...' ? (
          <span className='px-4 py-2'>...</span>
        ) : (
          <PaginationLink
            href='#'
            isActive={currentPage === p}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(p);
            }}
          >
            {p}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        <div className='flex my-[10px] items-center gap-[10px]'>
          <div className='w-[60px] h-[60px] bg-gray-200 rounded-full' />
          <p className='text-[30px] font-bold'>Find a Recycling Location</p>
        </div>
        <p className='text-lg'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className='mt-8'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <div className='flex items-center flex-grow'>
              <Input
                type='text'
                placeholder='Search by location name...'
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
                initialFilters={filters}
                categories={categories}
                onApplyFilters={applyFilters}
              />
              <Select
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
                defaultValue={sortBy}
              >
                <SelectTrigger className='w-[220px] bg-green-800 text-white'>
                  <ArrowUpDown className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='nearest'>Nearest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-[30px] min-h-[400px] my-8'>
          {isLoading ? (
            <p className='py-10 text-center col-span-full'>
              Loading locations...
            </p>
          ) : locations.length > 0 ? (
            locations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                setSelectedLocationId={setSelectedLocationId}
                setPage={setPage}
              />
            ))
          ) : (
            <p className='py-10 text-center text-gray-500 col-span-full'>
              No recycling locations found. Try adjusting your search or
              filters.
            </p>
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
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(meta.totalPages, p + 1));
                    }}
                    disabled={currentPage === meta.totalPages}
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
