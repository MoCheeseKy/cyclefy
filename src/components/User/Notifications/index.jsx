import { useState } from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import { Button } from '@/components/ui/button';

export default function Notifications() {
  const categories = [
    'All',
    'Donation',
    'Barter',
    'Borrowing',
    'Recycling',
    'Repair',
  ];
  const filters = ['Today', 'Yesterday', 'A week ago', 'A month ago'];

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Today');

  // Contoh data dummy
  const notifications = [
    {
      id: 1,
      type: 'Donation',
      title: 'Donation - Submitted',
      message: 'The {item name} has been submitted for donation',
      time: '5h ago',
      actions: false,
    },
    {
      id: 2,
      type: 'Barter',
      title: 'Barter - Waiting for Confirmation',
      message:
        'User Z has submitted a barter request to exchange his {item name} with your {item name}, awaiting your confirmation.',
      time: '7h ago',
      actions: true,
    },
    {
      id: 3,
      type: 'Borrowing',
      title: 'Borrowing - Waiting for Confirmation',
      message: 'abcde05',
      time: '8h ago',
      actions: true,
    },
    {
      id: 4,
      type: 'Borrowing',
      title: 'Borrowing - Waiting for Confirmation',
      message: 'abcde05',
      time: '8h ago',
      actions: true,
    },
  ];

  const filteredNotifications =
    activeCategory === 'All'
      ? notifications
      : notifications.filter((n) => n.type === activeCategory);

  return (
    <div className='flex justify-center py-20'>
      <Wrapper>
        <div className='flex gap-8'>
          {/* Sidebar */}
          <div className='flex flex-col w-40 gap-2'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-left px-2 py-1 rounded-md ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Filter Tabs + Mark all */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex gap-2'>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1 rounded-md font-medium ${
                      activeFilter === f
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Button variant='secondary' className='text-gray-600 bg-gray-300'>
                Mark all as read
              </Button>
            </div>

            {/* Notifications List */}
            <div className='flex flex-col gap-3'>
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className='flex items-start justify-between p-4 bg-gray-200 rounded-md'
                >
                  <div>
                    <h3 className='font-semibold text-gray-900'>{n.title}</h3>
                    <p className='text-sm text-gray-700'>{n.message}</p>
                    {n.actions && (
                      <div className='flex gap-2 mt-2'>
                        <Button
                          size='sm'
                          className='text-white bg-green-500 hover:bg-green-600'
                        >
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          className='text-white bg-red-500 hover:bg-red-600'
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                  <span className='text-xs text-gray-500'>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
