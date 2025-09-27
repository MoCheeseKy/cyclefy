import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ExternalLink,
  User,
  MapPin,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import BorrowDetailContent from './BorrowDetailContent';
import BarterDetailContent from './BarterDetailContent';

const statusColors = {
  submitted: 'bg-gray-600 text-white',
  request_submitted: 'bg-gray-600 text-white',
  waiting_for_request: 'bg-gray-600 text-white',
  waiting_for_confirmation: 'bg-yellow-500 text-black',
  confirmed: 'bg-blue-600 text-white',
  completed: 'bg-green-600 text-white',
  failed: 'bg-red-600 text-white',
  cancelled: 'bg-red-600 text-white',
  under_repair: 'bg-yellow-500 text-black',
  lent: 'bg-indigo-600 text-white',
  borrowed: 'bg-indigo-600 text-white',
  returned: 'bg-teal-600 text-white',
  overdue: 'bg-orange-500 text-white',
  extended: 'bg-purple-600 text-white',
};

export default function HistoryCard({ item, type }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const imageUrl =
    item.images?.[0] ||
    'https://dummyimage.com/150x150/e0e0e0/000&text=No+Image';
  const statusText = item.status?.status.replace(/_/g, ' ') || 'N/A';
  const statusColorClass =
    statusColors[item.my_items?.status?.status.replace(/_/g, ' ')] ||
    'bg-gray-400 text-white';

  const fetchDetails = async () => {
    setIsDetailLoading(true);
    setDetailError(null);
    const token = localStorage.getItem('cyclefy_user_token');
    let endpointPath;

    switch (type) {
      case 'donation':
        endpointPath = `/users/current/donations/${item.id}`;
        break;
      case 'recycle':
        endpointPath = `/users/current/recycles/${item.id}`;
        break;
      case 'repair':
        endpointPath = `/users/current/repairs/${item.id}`;
        break;
      case 'borrow':
        endpointPath = item.user
          ? `/users/current/borrow-requests/${item.id}`
          : `/users/current/borrows/${item.id}`;
        break;
      case 'barter':
        endpointPath = item.user
          ? `/users/current/barter-requests/${item.id}`
          : `/users/current/barters/${item.id}`;
        break;
      default:
        setIsDetailLoading(false);
        return;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_HOST}${endpointPath}`;

    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetailData(response.data.data);
    } catch (error) {
      setDetailError('Failed to load details. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not fetch ${type} details.`,
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleToggleDetail = () => {
    const nextIsOpen = !isDetailOpen;
    setIsDetailOpen(nextIsOpen);

    const supportedTypes = [
      'donation',
      'recycle',
      'repair',
      'borrow',
      'barter',
    ];
    if (nextIsOpen && !detailData && supportedTypes.includes(type)) {
      fetchDetails();
    }
  };

  const renderDetailContent = () => {
    if (isDetailLoading) {
      return (
        <div className='flex items-center justify-center p-8'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      );
    }
    if (detailError) {
      return (
        <div className='flex items-center justify-center p-8 text-red-500'>
          {detailError}
        </div>
      );
    }
    if (detailData) {
      switch (type) {
        case 'borrow':
          return (
            <BorrowDetailContent
              detailData={detailData}
              borrowId={item.id}
              onActionSuccess={fetchDetails}
            />
          );
        case 'barter':
          return (
            <BarterDetailContent
              detailData={detailData}
              item={item}
              onActionSuccess={fetchDetails}
            />
          );
        case 'donation':
        case 'recycle':
        case 'repair':
          return (
            <div className='p-6 bg-gray-200'>
              <p className='font-semibold text-center text-gray-700'>
                ID. {detailData.id}
              </p>
              <hr className='my-4 border-gray-400' />
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-bold text-gray-800'>Address</h4>
                  <p className='text-sm text-gray-600'>
                    {detailData.address?.address || 'Address not available'}
                  </p>
                </div>
                <div>
                  <h4 className='mb-2 font-bold text-gray-800'>Status</h4>
                  <div className='relative flex flex-col gap-6 pl-5'>
                    <div className='absolute top-2 bottom-2 left-[9px] w-0.5 bg-gray-400'></div>
                    {detailData.status_histories.map((history) => {
                      const isFailed =
                        history.status === 'failed' ||
                        history.status === 'cancelled';
                      return (
                        <div key={history.id} className='relative ml-[-17px]'>
                          <div className='absolute -left-[2px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-gray-200'>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                isFailed ? 'bg-red-500' : 'bg-secondary'
                              }`}
                            >
                              {isFailed ? (
                                <X className='w-3 h-3 text-white' />
                              ) : (
                                <Check className='w-3 h-3 text-white' />
                              )}
                            </div>
                          </div>
                          <div className='ml-8'>
                            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                              <span className='px-3 py-1 text-xs font-semibold text-white capitalize rounded-md bg-secondary'>
                                {history.status.replace(/_/g, ' ')}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {format(
                                  new Date(history.updated_at),
                                  'dd-MM-yyyy HH:mm'
                                )}
                              </span>
                            </div>
                            <p className='mt-1 text-sm text-gray-600'>
                              {history.status_detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='flex flex-col gap-4 p-4 sm:flex-row'>
        <div className='relative flex-shrink-0 w-full h-40 overflow-hidden rounded-md sm:w-24 sm:h-24'>
          <Image
            src={imageUrl}
            alt={item.item_name}
            layout='fill'
            objectFit='cover'
          />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
            <h3 className='text-lg font-bold text-gray-800 truncate'>
              {item.item_name}
            </h3>
            <div
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColorClass}`}
            >
              {statusText}
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2 mt-1'>
            <span className='px-2 py-0.5 text-xs text-white bg-green-700 rounded-md capitalize'>
              {type}
            </span>
            <span className='px-2 py-0.5 text-xs text-gray-700 bg-gray-200 rounded-md'>
              {item.category.name}
            </span>
          </div>
          <p className='mt-2 text-sm text-gray-600 line-clamp-2'>
            {item.description}
          </p>
          {item.user && (
            <div className='flex items-center gap-4 pt-3 mt-3 border-t'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <User className='w-4 h-4' />
                <span>{item.user.fullname}</span>
              </div>
              {item.distance !== undefined && (
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <MapPin className='w-4 h-4' />
                  <span>{item.distance.toFixed(1)} km</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='flex-shrink-0 text-sm text-left text-gray-500 sm:text-right'>
          {format(new Date(item.status.updated_at), 'dd-MM-yyyy HH:mm')}
        </div>
      </div>

      <div className='px-4 pb-2'>
        <button
          onClick={handleToggleDetail}
          className='flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-secondary hover:bg-primary'
        >
          Detail
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isDetailOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isDetailOpen && (
        <div className='border-t border-gray-200'>{renderDetailContent()}</div>
      )}
    </div>
  );
}
