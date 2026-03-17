import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found | SkaloRecruit"
        description="The page you're looking for doesn't exist. Return to SkaloRecruit's homepage to find executive recruitment services and job opportunities."
        noindex
      />
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-brand-surface)]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="font-heading text-8xl font-bold text-secondary-200 mb-4">404</div>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-brand-text)] mb-4">Page Not Found</h1>
          <p className="text-[var(--color-brand-text-muted)] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" leftIcon={<Home size={18} />}>Back to Home</Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" leftIcon={<ArrowLeft size={18} />}>Go Back</Button>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
