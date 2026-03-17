import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';

const Home     = lazy(() => import('@/pages/Home'));
const Services = lazy(() => import('@/pages/Services'));
const Contact  = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout transparentNav />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/services"   element={<Services />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="*"           element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
