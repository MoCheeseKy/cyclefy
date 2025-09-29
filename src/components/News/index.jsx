// pages/news/index.jsx (atau path yang sesuai)
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Wrapper from '../_shared/Wrapper';
import NewsCard from './NewsCard'; // Sesuaikan path jika perlu
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loader2, ArrowUpDown, Mail, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function News() {
  const { toast } = useToast();
  const [newsList, setNewsList] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');

    const params = {
      page: currentPage,
      size: 12,
      search: searchTerm || undefined,
      orderBy,
    };

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/news`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setNewsList(response.data.data || []);
      setMeta(response.data.meta || { page: 1, totalPages: 1 });
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load News',
        description: 'Could not fetch news from the server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, orderBy, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(inputValue);
  };

  const handleSortChange = (value) => {
    setCurrentPage(1);
    setOrderBy(value);
  };

  return (
    <div className='flex justify-center py-20 bg-gray-50'>
      <Wrapper>
        <div className='flex items-center gap-2 mb-8 text-sm text-gray-500'>
          <Link href='/' className='hover:text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4' />
          <Link href='/#news' className='font-bold text-tertiary'>
            News
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <div className='w-[60px] h-[60px] bg-white text-black flex items-center justify-center rounded-full'>
              <Mail size={42} />
            </div>
            <h1 className='text-[30px] font-bold'>Explore News</h1>
          </div>
          <p className='text-gray-600'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className='flex flex-col gap-4 mt-8 sm:flex-row'>
          <div className='flex items-center flex-grow'>
            <Input
              type='text'
              placeholder='Search by news title...'
              className='rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className='rounded-l-none bg-secondary hover:bg-primary'
            >
              Search
            </Button>
          </div>
          <Select onValueChange={handleSortChange} defaultValue={orderBy}>
            <SelectTrigger className='w-full sm:w-[180px]  text-base bg-secondary text-white'>
              <ArrowUpDown className='w-4 h-4 mr-2' />
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 min-h-[500px]'>
          {isLoading ? (
            <div className='flex items-center justify-center col-span-full'>
              <Loader2 className='w-10 h-10 text-gray-400 animate-spin' />
            </div>
          ) : newsList.length > 0 ? (
            newsList.map((news) => <NewsCard key={news.id} news={news} />)
          ) : (
            <div className='text-center text-gray-500 col-span-full'>
              <p>No news found. Try a different search term.</p>
            </div>
          )}
        </div>

        {!isLoading && meta.totalPages > 1 && (
          <div className='flex justify-center mt-10'>
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
                {[...Array(meta.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href='#'
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
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
