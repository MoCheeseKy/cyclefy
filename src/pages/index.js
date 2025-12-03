import Layout from '@/layouts';
import Home from '@/components/Home';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Cyclefy</title>
        <link rel='icon' href='/logo-ct.png' />
      </Head>
      <Layout>
        <Home />
      </Layout>
    </>
  );
}
