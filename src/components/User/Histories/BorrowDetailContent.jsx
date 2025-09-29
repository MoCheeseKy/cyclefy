import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';

// Komponen kecil untuk menampilkan satu kartu permintaan
function RequestCard({ request, onAccept, onDecline, isProcessing }) {
  return (
    <div className='flex flex-col gap-3 p-3 bg-gray-100 rounded-md sm:flex-row'>
      <img
        src={
          request.user.profile_picture ||
          'https://placehold.co/48x48/e0e0e0/000?text=NP'
        }
        alt={request.user.fullname}
        width={48}
        height={48}
        className='object-cover w-12 h-12 rounded-full'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <span className='font-semibold truncate'>
            {request.user.fullname}
          </span>
          <span className='flex-shrink-0 ml-2 text-xs text-gray-500'>
            {request.distance?.toFixed(1) || '0'} km
          </span>
        </div>
        <p className='mt-1 text-xs text-gray-600 line-clamp-2'>
          {request.reason}
        </p>
      </div>
      <div className='flex flex-row gap-2 mt-2 sm:flex-col sm:mt-0'>
        <Button
          size='sm'
          className='flex-1 bg-red-500 hover:bg-red-600 h-7'
          onClick={() => onDecline(request.id)}
          disabled={isProcessing}
        >
          Decline
        </Button>
        <Button
          size='sm'
          className='flex-1 h-7'
          onClick={() => onAccept(request.id)}
          disabled={isProcessing}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}

export default function BorrowDetailContent({
  detailData,
  borrowId,
  onActionSuccess,
}) {
  const { toast } = useToast();
  const [processingAction, setProcessingAction] = useState(null);

  const handleAction = async (action, requestId = null, body = {}) => {
    const actionId = requestId ? `${action}-${requestId}` : action;
    setProcessingAction(actionId);

    const token = localStorage.getItem('cyclefy_user_token');
    let endpoint = `${process.env.NEXT_PUBLIC_HOST}/users/current/borrows/${borrowId}`;
    let method = 'post';

    switch (action) {
      case 'accept':
        endpoint += `/requests/${requestId}/accept`;
        break;
      case 'decline':
        endpoint += `/requests/${requestId}/decline`;
        break;
      case 'lent':
        endpoint += '/mark-as-lent';
        break;
      case 'returned':
        endpoint += '/mark-as-returned';
        break;
      case 'completed':
        endpoint += '/mark-as-completed';
        break;
      case 'extend':
        endpoint += `/requests/${requestId}/extend`;
        break;
      default:
        setProcessingAction(null);
        return;
    }

    try {
      await axios[method](endpoint, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Success',
        description: `Action "${action.replace(/_/g, ' ')}" was successful.`,
      });
      if (onActionSuccess) {
        onActionSuccess();
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const renderActionButtons = () => {
    const status = detailData.status?.status;
    const acceptedRequest = detailData.requests?.find(
      (r) => r.status === 'accepted'
    );

    switch (status) {
      case 'confirmed':
        return (
          <div className='flex flex-col gap-2 mt-4 sm:flex-row'>
            <Button className='flex-1' variant='outline'>
              Contact {acceptedRequest?.user.fullname}
            </Button>
            <Button
              className='flex-1'
              onClick={() => handleAction('lent')}
              disabled={!!processingAction}
            >
              {processingAction === 'lent' ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Mark as Lent'
              )}
            </Button>
          </div>
        );
      case 'lent':
      case 'overdue':
      case 'extended':
        return (
          <div className='flex flex-col gap-2 mt-4 sm:flex-row'>
            <Button
              className='flex-1'
              onClick={() => handleAction('returned')}
              disabled={!!processingAction}
            >
              {processingAction === 'returned' ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Mark as Returned'
              )}
            </Button>
            <Button className='flex-1' variant='outline'>
              Extend
            </Button>
          </div>
        );
      case 'returned':
        return (
          <Button
            className='w-full mt-4'
            onClick={() => handleAction('completed')}
            disabled={!!processingAction}
          >
            {processingAction === 'completed' ? (
              <Loader2 className='animate-spin' />
            ) : (
              'Mark as Completed'
            )}
          </Button>
        );
      case 'completed':
        return <Button className='w-full mt-4'>Lend Again</Button>;
      default:
        return null;
    }
  };

  return (
    <div className='p-4 bg-gray-100 md:p-6'>
      <p className='font-semibold text-center text-gray-700'>
        ID. {detailData.id}
      </p>
      <hr className='my-4 border-gray-300' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div>
          <h4 className='mb-2 font-bold text-gray-800'>Address</h4>
          <p className='text-sm text-gray-600'>
            {detailData.address?.address || 'N/A'}
          </p>

          {detailData.status?.status === 'waiting_for_confirmation' &&
            detailData.requests?.length > 0 && (
              <div className='mt-6'>
                <h4 className='mb-2 font-bold text-gray-800'>
                  Incoming Requests
                </h4>
                <div className='space-y-3'>
                  {detailData.requests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onAccept={(reqId) => handleAction('accept', reqId)}
                      onDecline={(reqId) => handleAction('decline', reqId)}
                      isProcessing={!!processingAction}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
        <div>
          <h4 className='mb-2 font-bold text-gray-800'>Status</h4>
          <div className='relative flex flex-col gap-6 pl-5'>
            <div className='absolute top-2 bottom-2 left-[9px] w-0.5 bg-gray-300'></div>
            {detailData.status_histories.map((history) => (
              <div key={history.id} className='relative ml-[-17px]'>
                <div className='absolute -left-[2px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100'>
                  <div className='flex items-center justify-center w-4 h-4 rounded-full bg-secondary'>
                    <Check className='w-3 h-3 text-white' />
                  </div>
                </div>
                <div className='ml-8'>
                  <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                    <span className='px-3 py-1 text-xs font-semibold text-white capitalize rounded-md bg-secondary'>
                      {history.status.replace(/_/g, ' ')}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {format(new Date(history.updated_at), 'dd-MM-yyyy HH:mm')}
                    </span>
                  </div>
                  <p className='mt-1 text-sm text-gray-600'>
                    {history.status_detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}
