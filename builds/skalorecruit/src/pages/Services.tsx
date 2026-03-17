import { Users, Briefcase, TrendingUp, Globe, Clock, Shield, Search, Handshake, LineChart } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { ServiceCards } from '@/components/sections/ServiceCards';
import { FAQAccordion } from '@/components/sections/FAQAccordion';
import { CTABlock } from '@/components/sections/CTABlock';
import { StatsBar } from '@/components/sections/StatsBar';
import { buildServiceSchema, buildWebPageSchema, buildFAQSchema } from '@/components/seo/schemas';
import { SEO_DATA } from '@/data/seo';
import { employerFAQs } from '@/data/faqs';

const PAGE = SEO_DATA.services;

const stats = [
  { value: 10, label: 'Avg. days to shortlist', suffix: '' },
  { value: 94, suffix: '%', label: 'Offer acceptance rate' },
  { value: 90, label: 'Day placement guarantee', suffix: '-day' },
  { value: 4, label: 'Avg. candidates per brief', suffix: '–6' },
];

const serviceOfferings = [
  {
    icon: <Search size={28} />,
    title: 'Executive Search',
    description: 'Confidential retained search for senior leadership. We map the entire market and directly approach the best passive candidates.',
    features: ['Board & C-Suite appointments', 'Confidential search management', 'Competitor talent mapping', 'Reference & background checks', 'Onboarding support'],
    href: '/contact',
    accent: true,
  },
  {
    icon: <Users size={28} />,
    title: 'Permanent Recruitment',
    description: 'High-quality permanent hires from Manager to Director level. We combine network reach with rigorous screening.',
    features: ['Manager to Director level', 'Finance & Technology focus', 'Retained & contingency options', '90-day replacement guarantee', 'Salary benchmarking included'],
    href: '/contact',
  },
  {
    icon: <Clock size={28} />,
    title: 'Contract & Interim',
    description: 'Specialist contractors and interim managers available rapidly. Fully IR35 compliant for all UK engagements.',
    features: ['3-month to 2-year contracts', 'Available at 1 week notice', 'IR35 compliance managed', 'Finance transformation specialists', 'Technology project delivery'],
    href: '/contact',
  },
];

const process = [
  { icon: <Briefcase size={24} />, title: 'Role Briefing', description: 'We invest time to understand your business, team, and the exact profile you need — beyond the job description.' },
  { icon: <Search size={24} />, title: 'Market Mapping', description: 'We identify every qualified candidate in the market using our network, database, and direct sourcing techniques.' },
  { icon: <Users size={24} />, title: 'Rigorous Screening', description: 'Structured competency interviews, skills assessment, and cultural fit evaluation for every shortlisted candidate.' },
  { icon: <Handshake size={24} />, title: 'Shortlist Delivery', description: 'We present 4–6 candidates with detailed profiles within 10 business days. No volume, just quality.' },
  { icon: <LineChart size={24} />, title: 'Offer Management', description: 'We manage the entire offer process — negotiation, counteroffers, and resignation support to secure your first choice.' },
  { icon: <Shield size={24} />, title: '90-Day Guarantee', description: 'If a permanent placement leaves within 90 days, we re-recruit at no additional cost. Full stop.' },
];

const sectors = [
  { icon: <TrendingUp size={24} />, title: 'Financial Services', description: 'Banking, asset management, private equity, hedge funds, insurance, and financial technology.' },
  { icon: <Globe size={24} />, title: 'Technology', description: 'FinTech, SaaS, enterprise software, data & analytics, cybersecurity, and cloud infrastructure.' },
  { icon: <Briefcase size={24} />, title: 'Professional Services', description: 'Management consulting, legal, accounting, tax, audit, and corporate advisory.' },
];

export default function Services() {
  return (
    <>
      <SEOHead
        title={PAGE.title}
        description={PAGE.description}
        canonical={PAGE.canonical}
        schema={[
          buildWebPageSchema({ name: PAGE.title, description: PAGE.description, url: PAGE.canonical }),
          buildServiceSchema({ name: 'Executive Recruitment Services', description: PAGE.description, url: PAGE.canonical }),
          buildFAQSchema(employerFAQs),
        ]}
      />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-[var(--color-primary-800)] to-[var(--color-secondary-700)] text-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-4">For Employers</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{PAGE.h1}</h1>
          <p className="text-white/70 text-xl leading-relaxed max-w-2xl mx-auto">
            Specialist recruitment for finance and technology. Senior consultants, deep networks, and results that speak for themselves.
          </p>
        </div>
      </section>

      <StatsBar stats={stats} background="surface" />

      <ServiceCards
        eyebrow="Our Services"
        heading="Three Ways We Help You Hire"
        subheading="Whether you need an interim solution or a permanent leadership appointment, we have a service model to fit."
        services={serviceOfferings}
      />

      <FeaturesGrid
        eyebrow="Our Process"
        heading="How We Work"
        subheading="A disciplined process that delivers quality candidates without wasting your time."
        features={process}
        columns={3}
        background="surface"
      />

      <FeaturesGrid
        eyebrow="Sector Expertise"
        heading="Deep Sector Knowledge"
        subheading="We don't recruit across every industry. We go deep in the sectors we know best."
        features={sectors}
        columns={3}
        background="white"
      />

      <FAQAccordion
        eyebrow="FAQs"
        heading="Common Questions"
        items={employerFAQs}
      />

      <CTABlock
        heading="Let's Talk About Your Hiring Needs"
        subheading="No obligation. Tell us what you're looking for and we'll tell you honestly if and how we can help."
        primaryCTA={{ text: 'Contact Our Team', href: '/contact' }}
        secondaryCTA={{ text: 'View Industries', href: '/industries' }}
        background="gradient"
      />
    </>
  );
}
