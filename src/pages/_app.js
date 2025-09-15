import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default App;
