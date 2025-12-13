import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Wrapper from '@/components/_shared/Wrapper';
import HistoryList from './HistoryList';

import { ChevronsUpDown } from 'lucide-react';

const sideTabs = [
  { name: 'Donation', value: 'donation', endpoint: '/users/current/donations' },
  { name: 'Barter', value: 'barter', endpoint: '/users/current/barters' },
  { name: 'Borrowing', value: 'borrow', endpoint: '/users/current/borrows' },
  { name: 'Recycling', value: 'recycle', endpoint: '/users/current/recycles' },
  { name: 'Repair', value: 'repair', endpoint: '/users/current/repairs' },
];

export default function UserHistories() {
  const [activeTab, setActiveTab] = useState('donation');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const historyType = params.get('history_type');
    const validTab = sideTabs.find((tab) => tab.value === historyType);
    if (validTab) {
      setActiveTab(validTab.value);
    } else if (historyType === 'barter') {
      setActiveTab('barter');
    } else if (historyType === 'borrow') {
      setActiveTab('borrow');
    } else if (historyType === 'recycle') {
      setActiveTab('recycle');
    } else if (historyType === 'repair') {
      setActiveTab('repair');
    } else {
      setActiveTab('donation');
    }
  }, []);

  const activeEndpoint = sideTabs.find(
    (tab) => tab.value === activeTab
  )?.endpoint;

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    const url = new URL(window.location);
    url.searchParams.set('history_type', tabValue);
    window.history.pushState({}, '', url);
  };

  return (
    <div className='flex justify-center py-10 bg-gray-50 md:py-16'>
      <Wrapper>
        <h1 className='mb-6 text-3xl font-bold text-gray-800 md:mb-8 md:text-4xl'>
          History
        </h1>
        <div className='flex flex-col gap-8 md:flex-row'>
          <aside className='w-full md:w-48 md:flex-shrink-0'>
            <div className='flex-col hidden gap-2 md:flex'>
              {sideTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
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
            <div className='relative w-full md:hidden'>
              <select
                value={activeTab}
                onChange={(e) => handleTabChange(e.target.value)}
                className='w-full p-3 text-base font-semibold border border-gray-300 rounded-lg appearance-none'
              >
                {sideTabs.map((tab) => (
                  <option key={tab.value} value={tab.value}>
                    {tab.name}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className='absolute w-5 h-5 text-gray-500 -translate-y-1/2 top-1/2 right-4' />
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
