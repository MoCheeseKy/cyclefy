import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const categories = [
  { name: 'All', value: 'all' },
  { name: 'Donation', value: 'donation' },
  { name: 'Barter', value: 'barter' },
  { name: 'Borrowing', value: 'borrow' },
  { name: 'Recycling', value: 'recycle' },
  { name: 'Repair', value: 'repair' },
];

const periods = [
  { name: 'Today', value: 'today' },
  { name: 'Yesterday', value: 'yesterday' },
  { name: 'A week ago', value: 'a_week_ago' },
  { name: 'A month ago', value: 'a_month_ago' },
];

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, size: 10, totalPages: 1 });
  const [activeType, setActiveType] = useState('all');
  const [activePeriod, setActivePeriod] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to see notifications.',
      });
      setIsLoading(false);
      return;
    }

    const params = {
      type: activeType === 'all' ? undefined : activeType,
      period: activePeriod,
      page: currentPage,
      size: 10,
    };

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/users/current/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setNotifications(response.data.notifications || []);
      setMeta(response.data.meta || { page: 1, size: 10, totalPages: 1 });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Load Notifications',
        description: 'Could not fetch data from the server.',
      });
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeType, activePeriod, currentPage, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    setIsMarkingRead(true);
    const token = localStorage.getItem('cyclefy_user_token');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in.',
      });
      setIsMarkingRead(false);
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_HOST}/users/current/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: 'Success',
        description: 'All notifications have been marked as read.',
      });

      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: 'Could not mark all notifications as read.',
      });
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleTypeChange = (typeValue) => {
    setActiveType(typeValue);
    setCurrentPage(1);
  };

  const handlePeriodChange = (periodValue) => {
    setActivePeriod(periodValue);
    setCurrentPage(1);
  };

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        <div className='flex gap-8'>
          <div className='flex-col hidden w-40 gap-2 md:flex'>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleTypeChange(cat.value)}
                className={`text-left px-2 py-1 rounded-md transition-colors ${
                  activeType === cat.value
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className='flex-1'>
            <div className='flex flex-col items-start gap-4 mb-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-wrap gap-2'>
                {periods.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePeriodChange(p.value)}
                    className={`px-4 py-1 rounded-md font-medium transition-colors ${
                      activePeriod === p.value
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <Button
                variant='secondary'
                onClick={handleMarkAllAsRead}
                disabled={isMarkingRead || isLoading}
              >
                {isMarkingRead && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Mark all as read
              </Button>
            </div>

            <div className='flex flex-col gap-3 min-h-[400px]'>
              {isLoading ? (
                <div className='flex items-center justify-center h-full'>
                  <Loader2 className='w-8 h-8 text-gray-500 animate-spin' />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start justify-between p-4 rounded-md border transition-colors ${
                      !n.is_read
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div>
                      <h3
                        className={`font-semibold ${
                          !n.is_read ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {n.title}
                      </h3>
                      <p className='text-sm text-gray-700'>{n.message}</p>
                    </div>
                    <span className='ml-4 text-xs text-gray-500 whitespace-nowrap'>
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500'>
                  <p>No notifications found for this filter.</p>
                </div>
              )}
            </div>

            {!isLoading && meta.totalPages > 1 && (
              <div className='flex justify-center mt-8'>
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant='outline'
                >
                  Previous
                </Button>
                <span className='flex items-center mx-4 text-sm'>
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
        </div>
      </Wrapper>
    </div>
  );
}
