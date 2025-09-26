import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Wrapper from '@/components/_shared/Wrapper';
import HistoryList from './HistoryList';

const sideTabs = [
  { name: 'Donation', value: 'donation', endpoint: '/users/current/donations' },
  { name: 'Barter', value: 'barter', endpoint: '/users/current/barters' },
  { name: 'Borrowing', value: 'borrow', endpoint: '/users/current/borrows' },
  { name: 'Recycling', value: 'recycle', endpoint: '/users/current/recycles' },
  { name: 'Repair', value: 'repair', endpoint: '/users/current/repairs' },
];

export default function UserHistories() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (router.isReady) {
      const { history_type } = router.query;
      const validTab = sideTabs.find((tab) => tab.value === history_type);
      if (validTab) {
        setActiveTab(validTab.value);
      }
    }
  }, [router.isReady, router.query]);

  const activeEndpoint = sideTabs.find(
    (tab) => tab.value === activeTab
  )?.endpoint;

  return (
    <div className='flex justify-center py-16 bg-gray-50'>
      <Wrapper>
        <h1 className='mb-8 text-4xl font-bold text-gray-800'>History</h1>
        <div className='flex flex-col gap-8 md:flex-row'>
          <aside className='flex-shrink-0 w-full md:w-48'>
            <div className='flex flex-col gap-2'>
              {sideTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.value
                      ? 'bg-primary text-white shadow'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </aside>

          <main className='flex-1 min-w-0'>
            <HistoryList
              key={activeTab}
              historyType={activeTab}
              endpoint={activeEndpoint}
            />
          </main>
        </div>
      </Wrapper>
    </div>
  );
}
