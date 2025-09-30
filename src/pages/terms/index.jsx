import Link from 'next/link';
import Layout from '@/layouts';
import Wrapper from '@/components/_shared/Wrapper';
import { ChevronRight } from 'lucide-react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  const terms = [
    'Use the platform responsibly and ethically.',
    'Do not list illegal, severely damaged, or harmful items.',
    'Communicate respectfully and honestly with other users.',
    'Do not misuse features such as ratings, comments, or item listings.',
    'Provide accurate information when listing an item.',
  ];

  return (
    <Layout>
      <div className='flex justify-center py-10 bg-gray-50 md:py-20'>
        <Wrapper>
          <div className='flex items-center gap-2 text-sm font-medium md:text-base'>
            <Link href='/' className='text-gray-500 hover:text-primary'>
              Cyclefy
            </Link>
            <ChevronRight className='w-4 h-4 text-gray-500' />
            <div className='font-semibold text-primary'>Terms of Service</div>
          </div>

          <div className='max-w-4xl mx-auto mt-8'>
            <div className='flex flex-col items-center text-center md:flex-row md:text-left md:gap-4'>
              <FileText className='w-8 h-8 text-primary md:w-10 md:h-10' />
              <div>
                <h1 className='text-2xl font-bold text-gray-800 md:text-3xl'>
                  Terms of Services
                </h1>
              </div>
            </div>

            <div className='mt-6 space-y-6'>
              <p className='text-base text-gray-600'>
                By using Cyclefy, you agree to the following terms:
              </p>
              <ol className='ml-6 space-y-2 text-gray-600 list-decimal'>
                {terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ol>
              <p className='font-semibold text-gray-800'>
                Violation of these terms may result in suspension or removal of
                your account.
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}
