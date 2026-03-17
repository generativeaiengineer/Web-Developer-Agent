import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface LayoutProps {
  transparentNav?: boolean;
}

export function Layout({ transparentNav = false }: LayoutProps) {
  return (
    <>
      <Navigation transparent={transparentNav} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
