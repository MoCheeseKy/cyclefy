import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import Wrapper from '@/components/_shared/Wrapper';
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
import { Loader2, ArrowUpDown, Mail, ChevronRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function NewsCard({ news }) {
  const imageUrl =
    news.images?.[0] || 'https://placehold.co/400x400/e0e0e0/000?text=News';

  return (
    <Link href={`/news/${news.id}/detail`} legacyBehavior>
      <a className='block h-full'>
        <Card className='h-full overflow-hidden transition-shadow duration-300 shadow-md cursor-pointer group hover:shadow-xl'>
          <CardContent className='p-0'>
            <div className='relative w-full aspect-square'>
              <img
                src={imageUrl}
                alt={news.title}
                className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
              />
            </div>
            <div className='p-4'>
              <p className='text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-primary'>
                {news.title}
              </p>
              <div className='flex items-center mt-2 text-xs text-gray-500'>
                <User className='w-3 h-3 mr-1.5' />
                <span>{news.author?.fullname || 'Admin'}</span>
                <span className='mx-2'>•</span>
                <span>
                  {format(new Date(news.created_at), 'MMMM dd, yyyy')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}

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

  const renderPaginationItems = () => {
    const total = meta.totalPages;
    const current = currentPage;
    const pages = [];
    const range = 1;
    if (total <= 1) return null;
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > range + 2) pages.push('...');
      for (
        let i = Math.max(2, current - range);
        i <= Math.min(total - 1, current + range);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - (range + 1)) pages.push('...');
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
    <div className='flex justify-center py-10 bg-gray-50 md:py-20'>
      <Wrapper>
        <div className='flex flex-wrap items-center gap-2 mb-6 text-sm text-gray-500 md:mb-8'>
          <Link href='/' className='hover:text-primary'>
            Cyclefy
          </Link>
          <ChevronRight className='w-4 h-4' />
          <span className='font-semibold text-primary'>News</span>
        </div>
        <div className='flex flex-col gap-2 mb-8'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 md:w-[60px] md:h-[60px] bg-white text-primary flex items-center justify-center rounded-full shadow-md'>
              <Mail className='w-6 h-6 md:w-8 md:h-8' />
            </div>
            <h1 className='text-2xl font-bold md:text-3xl'>Explore News</h1>
          </div>
          <p className='text-gray-600'>
            Stay updated with the latest articles, tips, and stories from our
            community.
          </p>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row'>
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
              className='rounded-l-none bg-primary hover:bg-primary/90'
            >
              Search
            </Button>
          </div>
          <Select onValueChange={handleSortChange} defaultValue={orderBy}>
            <SelectTrigger className='w-full text-base bg-white sm:w-auto'>
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
              <Loader2 className='w-10 h-10 text-primary animate-spin' />
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
