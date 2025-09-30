import Link from 'next/link';
import Layout from '@/layouts';
import Wrapper from '@/components/_shared/Wrapper';
import { ChevronRight, Lock, XCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'What We Collect',
      points: [
        'Name, email, phone number',
        'Profile details (such as campus, interests)',
        'Listing data (items you post, borrow, donate, etc.)',
        'Activity logs (messages, reviews, etc.)',
      ],
    },
    {
      title: 'How We Use It',
      points: [
        'To personalize your experience and improve app performance',
        'To match you with relevant users or item listings',
        'To ensure community safety and monitor for abuse',
      ],
    },
    {
      title: "What We Don't Do",
      points: [
        'We do not sell your data to any third party.',
        'We do not share your personal information without your consent.',
      ],
      icon: <XCircle className='w-5 h-5 text-red-500' />,
    },
    {
      title: 'Your Control',
      points: [
        'You can edit your profile at any time.',
        'You can request a full account and data deletion by contacting our support.',
        'We follow best practices in data security and encryption to keep your information safe.',
      ],
    },
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
            <div className='font-semibold text-primary'>Privacy Policy</div>
          </div>

          <div className='mt-8'>
            <div className='flex flex-col items-center text-center md:flex-row md:text-left md:gap-4'>
              <Lock className='w-8 h-8 text-primary md:w-10 md:h-10' />
              <div>
                <h1 className='text-2xl font-bold text-gray-800 md:text-3xl'>
                  Privacy Policy
                </h1>
                <p className='mt-1 text-gray-600'>
                  Cyclefy is committed to protecting your data and ensuring your
                  privacy. This is how we handle your information:
                </p>
              </div>
            </div>

            <div className='mt-8 space-y-8'>
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className='text-lg font-bold text-gray-900'>
                    {section.title}
                  </h2>
                  <ul className='mt-2 space-y-2'>
                    {section.points.map((point, index) => (
                      <li key={index} className='flex items-start gap-3'>
                        {section.icon ? (
                          <span className='flex-shrink-0 mt-1'>
                            {section.icon}
                          </span>
                        ) : (
                          <span className='flex-shrink-0 w-2 h-2 mt-2 bg-gray-500 rounded-full'></span>
                        )}
                        <span className='text-base text-gray-600'>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}
