import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isTransparent = transparent && !scrolled;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-[var(--shadow-nav)]',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded z-50 text-sm font-medium"
      >
        Skip to content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-heading">SR</span>
            </div>
            <span
              className={cn(
                'text-xl font-bold font-heading transition-colors',
                isTransparent ? 'text-white' : 'text-[var(--color-brand-text)]',
              )}
            >
              {SITE.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? isTransparent
                      ? 'text-white bg-white/20'
                      : 'text-secondary-600 bg-secondary-50'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)] hover:bg-[var(--color-brand-surface)]',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact">
              <Button variant={isTransparent ? 'outline' : 'primary'} size="sm"
                className={isTransparent ? 'border-white text-white hover:bg-white hover:text-primary-800' : ''}>
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'lg:hidden p-2 rounded-md transition-colors',
              isTransparent
                ? 'text-white hover:bg-white/10'
                : 'text-[var(--color-brand-text)] hover:bg-[var(--color-brand-surface)]',
            )}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={cn(
          'lg:hidden fixed inset-0 top-16 bg-white z-40 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="p-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                isActive(link.href)
                  ? 'text-secondary-600 bg-secondary-50'
                  : 'text-[var(--color-brand-text)] hover:bg-[var(--color-brand-surface)]',
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-[var(--color-brand-border)]">
            <Link to="/contact" className="block">
              <Button variant="primary" size="lg" className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
