import Link from 'next/link';
import Layout from '@/layouts';
import Wrapper from '@/components/_shared/Wrapper';
import { ChevronRight, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    {
      question: 'What is Cyclefy?',
      answer:
        'Cyclefy is a digital platform that enables recycling, donation, bartering, borrowing, and repairing of second-hand items—especially designed for university students to promote sustainability.',
    },
    {
      question: 'Is Cyclefy only for students?',
      answer:
        'While our main focus is the student community, some features and content are accessible to the general public.',
    },
    {
      question: 'Do I have to pay to use Cyclefy?',
      answer: 'No. All features on Cyclefy are completely free to use.',
    },
    {
      question: 'How do I donate an item?',
      answer:
        'Log in → Select "Donate" → Fill in item details → Upload photo → Submit. We\'ll help connect you with a suitable recipient.',
    },
    {
      question:
        'How do users handle item exchanges for bartering or borrowing?',
      answer:
        'Cyclefy does not provide any delivery or courier service. Users are expected to communicate directly and arrange a mutually convenient location to meet.',
    },
    {
      question: 'Is it safe to use Cyclefy?',
      answer:
        'Cyclefy encourages transparent communication and provides a user rating system to build trust. For safety, we recommend meeting in public spaces and bringing a friend when possible.',
    },
  ];

  return (
    <Layout>
      <div className='flex justify-center py-10 md:py-20 bg-gray-50'>
        <Wrapper>
          <div className='flex items-center gap-2 text-sm font-medium md:text-base'>
            <Link href='/' className='text-gray-500 hover:text-primary'>
              Cyclefy
            </Link>
            <ChevronRight className='w-4 h-4 text-gray-500' />
            <div className='font-semibold text-primary'>FAQ</div>
          </div>

          <div className='mt-8'>
            <div className='flex items-center gap-4'>
              <HelpCircle className='w-8 h-8 text-primary md:w-10 md:h-10' />
              <h1 className='text-2xl font-bold text-gray-800 md:text-3xl'>
                Frequently Asked Questions (FAQs)
              </h1>
            </div>

            <div className='mt-8 space-y-8'>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h2 className='text-lg font-bold text-gray-900'>
                    {faq.question}
                  </h2>
                  <p className='mt-2 text-base text-gray-600'>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}
