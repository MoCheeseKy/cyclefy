import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, User } from 'lucide-react';

// Card untuk menampilkan permintaan yang masuk (My Item view)
function IncomingRequestCard({
  request,
  onProcess,
  isProcessing,
  acceptedRequestId,
}) {
  const isAccepted = acceptedRequestId === request.id;
  const isDeclined = acceptedRequestId && !isAccepted;

  return (
    <div
      className={`p-3 rounded-md gap-3 transition-all ${
        isAccepted
          ? 'bg-green-100 border border-green-300'
          : isDeclined
          ? 'bg-gray-100 opacity-50'
          : 'bg-gray-50 border'
      }`}
    >
      <div className='flex gap-3'>
        <Image
          src={
            request.requester_item.images[0] ||
            'https://dummyimage.com/48x48/e0e0e0/000&text=No+Image'
          }
          alt={request.requester_item.item_name}
          width={48}
          height={48}
          className='object-cover w-12 h-12 rounded-md'
        />
        <div className='flex-1 min-w-0'>
          <span className='block font-semibold truncate'>
            {request.requester_item.item_name}
          </span>
          <div className='flex items-center gap-2 mt-1 text-xs text-gray-600'>
            <User className='w-3 h-3' />
            <span>{request.requester.fullname}</span>
            <span className='ml-2'>
              {request.distance?.toFixed(1) || '0'} km
            </span>
          </div>
        </div>
      </div>
      {!acceptedRequestId && (
        <div className='flex gap-2 mt-2'>
          <Button
            size='sm'
            variant='destructive'
            className='flex-1 h-7'
            onClick={() => onProcess(request.id, 'declined')}
            disabled={isProcessing}
          >
            Decline
          </Button>
          <Button
            size='sm'
            className='flex-1 h-7'
            onClick={() => onProcess(request.id, 'accepted')}
            disabled={isProcessing}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}

// Card untuk menampilkan barang yang ditawarkan (Other's Item view)
function BarterWithCard({ item }) {
  return (
    <div className='gap-3 p-3 bg-gray-100 border rounded-md'>
      <div className='flex gap-3'>
        <Image
          src={
            item.images[0] ||
            'https://dummyimage.com/48x48/e0e0e0/000&text=No+Image'
          }
          alt={item.item_name}
          width={48}
          height={48}
          className='object-cover w-12 h-12 rounded-md'
        />
        <div className='flex-1 min-w-0'>
          <span className='block font-semibold truncate'>{item.item_name}</span>
          <p className='mt-1 text-xs text-gray-600 line-clamp-2'>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BarterDetailContent({
  detailData,
  item,
  onActionSuccess,
}) {
  const { toast } = useToast();
  const [processingAction, setProcessingAction] = useState(null);
  const isMyItemView = !item.user;

  const handleProcessRequest = async (requestId, action) => {
    setProcessingAction(`${action}-${requestId}`);
    const token = localStorage.getItem('cyclefy_user_token');
    const endpoint = `${process.env.NEXT_PUBLIC_HOST}/users/current/barters/${item.id}/requests/${requestId}/process`;

    try {
      await axios.post(
        endpoint,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Success', description: `Request has been ${action}.` });
      onActionSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleMarkAsCompleted = async () => {
    setProcessingAction('completed');
    const token = localStorage.getItem('cyclefy_user_token');
    const endpoint = `${process.env.NEXT_PUBLIC_HOST}/users/current/barters/${item.id}/mark-as-completed`;
    try {
      await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: 'Success',
        description: 'Barter has been marked as completed.',
      });
      onActionSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const StatusTimeline = ({ histories }) => (
    <div>
      <h4 className='mb-2 font-bold text-gray-800'>Status</h4>
      <div className='relative flex flex-col gap-6 pl-5'>
        <div className='absolute top-2 bottom-2 left-[9px] w-0.5 bg-gray-400'></div>
        {histories.map((history) => {
          const isFailed =
            history.status === 'failed' || history.status === 'cancelled';
          return (
            <div key={history.id} className='relative ml-[-17px]'>
              <div className='absolute -left-[2px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-gray-200'>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isFailed ? 'bg-red-500' : 'bg-green-700'
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
                  <span className='px-3 py-1 text-xs font-semibold text-white capitalize bg-green-800 rounded-md'>
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
          );
        })}
      </div>
    </div>
  );

  return (
    <div className='p-6 bg-gray-200'>
      <p className='font-semibold text-center text-gray-700'>
        ID. {detailData.id}
      </p>
      <hr className='my-4 border-gray-400' />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {isMyItemView ? (
          <>
            <div>
              <h4 className='mb-2 font-bold text-gray-800'>Address</h4>
              <p className='text-sm text-gray-600'>
                {detailData.address?.address || 'N/A'}
              </p>
              {(detailData.status === 'waiting_for_confirmation' ||
                detailData.status === 'confirmed') &&
                detailData.requests?.length > 0 && (
                  <div className='mt-6'>
                    <h4 className='mb-2 font-bold text-gray-800'>
                      Incoming Requests
                    </h4>
                    <div className='space-y-3'>
                      {detailData.requests.map((req) => (
                        <IncomingRequestCard
                          key={req.id}
                          request={req}
                          onProcess={handleProcessRequest}
                          isProcessing={!!processingAction}
                          acceptedRequestId={detailData.accepted_request_id}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <div>
              <StatusTimeline histories={detailData.status_histories} />
              {detailData.status === 'confirmed' && (
                <Button
                  className='w-full mt-4'
                  onClick={handleMarkAsCompleted}
                  disabled={!!processingAction}
                >
                  {processingAction === 'completed' ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    'Mark as Completed'
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className='mb-2 font-bold text-gray-800'>Address</h4>
              <p className='text-sm text-gray-600'>
                {detailData.owner_address?.address || 'N/A'}
              </p>
              <div className='mt-6'>
                <h4 className='mb-2 font-bold text-gray-800'>
                  Barter With (My Item)
                </h4>
                <BarterWithCard item={detailData.requester_item} />
              </div>
            </div>
            <StatusTimeline histories={detailData.status_histories} />
          </>
        )}
      </div>
    </div>
  );
}
