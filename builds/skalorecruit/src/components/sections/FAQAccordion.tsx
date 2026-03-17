import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  eyebrow?: string;
  heading: string;
  items: FAQItem[];
}

function AccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  const answerId = `faq-answer-${index}`;

  return (
    <div className="border-b border-[var(--color-brand-border)] last:border-0">
      <button
        id={id}
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4 group"
      >
        <span className="font-heading font-semibold text-[var(--color-brand-text)] group-hover:text-secondary-600 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          size={20}
          className={cn('flex-shrink-0 text-[var(--color-brand-text-muted)] transition-transform duration-300', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <div
        id={answerId}
        role="region"
        aria-labelledby={id}
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="text-[var(--color-brand-text-muted)] leading-relaxed pb-5">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQAccordion({ eyebrow, heading, items }: FAQAccordionProps) {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={cn('text-center mb-12 transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
        >
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-secondary-600 mb-3">{eyebrow}</p>}
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-brand-text)]">{heading}</h2>
        </div>
        <div className="divide-y divide-[var(--color-brand-border)] rounded-xl border border-[var(--color-brand-border)] px-6">
          {items.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
