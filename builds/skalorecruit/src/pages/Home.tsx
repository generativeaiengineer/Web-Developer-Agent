import { Users, Target, Award, TrendingUp, Briefcase, Shield } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Hero } from '@/components/sections/Hero';
import { StatsBar } from '@/components/sections/StatsBar';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { ServiceCards } from '@/components/sections/ServiceCards';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABlock } from '@/components/sections/CTABlock';
import { buildOrganizationSchema, buildWebSiteSchema, buildWebPageSchema } from '@/components/seo/schemas';
import { SEO_DATA } from '@/data/seo';
import { testimonials } from '@/data/testimonials';

const PAGE = SEO_DATA.home;

const stats = [
  { value: 1200, suffix: '+', label: 'Placements Made' },
  { value: 94, suffix: '%', label: 'Offer Acceptance Rate' },
  { value: 15, suffix: '+', label: "Years' Experience" },
  { value: 320, suffix: '+', label: 'Client Companies' },
];

const whyUs = [
  {
    icon: <Target size={24} />,
    title: 'Specialist Networks',
    description: "Deep networks built over 15 years in finance and technology. We know the talent market and can access candidates that job boards can't.",
  },
  {
    icon: <Users size={24} />,
    title: 'Senior Consultants',
    description: 'Every client and candidate works directly with a senior consultant. No juniors, no handoffs. One expert relationship throughout.',
  },
  {
    icon: <Award size={24} />,
    title: 'Quality Over Volume',
    description: "We present 4–6 highly qualified candidates, not 40 lightly screened CVs. Your time is too valuable for noise.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Market Intelligence',
    description: 'Real-time salary benchmarking, competitor hiring data, and talent mapping to give you a competitive edge in every search.',
  },
  {
    icon: <Shield size={24} />,
    title: '90-Day Guarantee',
    description: "Every permanent placement is backed by our 90-day replacement guarantee. We're confident in our process and stand behind our work.",
  },
  {
    icon: <Briefcase size={24} />,
    title: 'End-to-End Service',
    description: 'From role briefing to offer negotiation and onboarding, we manage every step of the recruitment process on your behalf.',
  },
];

const services = [
  {
    icon: <Users size={28} />,
    title: 'Executive Search',
    description: 'Confidential, retained search for C-suite and Director-level appointments. Comprehensive market mapping and direct sourcing.',
    features: ['C-Suite & Board level', 'Confidential mandates', 'Market mapping included', 'Global reach'],
    href: '/services',
    accent: true,
  },
  {
    icon: <Briefcase size={28} />,
    title: 'Permanent Recruitment',
    description: 'Mid-to-senior permanent hiring for finance, technology and professional services roles across the UK and Europe.',
    features: ['Manager to Director', 'Finance & Technology', 'UK & European markets', '90-day guarantee'],
    href: '/services',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Contract & Interim',
    description: 'Flexible staffing for project delivery, parental cover, and business transformation. From 3 months to 2 years.',
    features: ['Flexible duration', 'Immediate availability', 'IR35 compliance', 'Rapid deployment'],
    href: '/services',
  },
];

export default function Home() {
  return (
    <>
      <SEOHead
        title={PAGE.title}
        description={PAGE.description}
        canonical={PAGE.canonical}
        schema={[buildOrganizationSchema(), buildWebSiteSchema(), buildWebPageSchema({ name: PAGE.title, description: PAGE.description, url: PAGE.canonical })]}
      />
      <Hero
        eyebrow="London's Specialist Executive Recruiter"
        heading="Executive Recruitment for"
        headingAccent="Finance & Technology"
        subheading="Connecting exceptional talent with leading employers across financial services, technology, and professional services since 2009."
        primaryCTA={{ text: 'Find Top Talent', href: '/services' }}
        secondaryCTA={{ text: 'Browse Jobs', href: '/jobs' }}
        showScrollIndicator
      />
      <StatsBar stats={stats} />
      <ServiceCards
        eyebrow="What We Do"
        heading="Recruitment Services Built for Results"
        subheading="From executive search to contract staffing — specialist recruitment solutions for the most demanding talent challenges."
        services={services}
      />
      <FeaturesGrid
        eyebrow="Why SkaloRecruit"
        heading="A Different Approach to Recruitment"
        subheading="We don't spray CVs and hope. Every search is precise, personal, and built on genuine market knowledge."
        features={whyUs}
        columns={3}
        background="surface"
      />
      <Testimonials
        eyebrow="Client Stories"
        heading="Trusted by 320+ Companies"
        testimonials={testimonials}
      />
      <CTABlock
        heading="Ready to Find Your Next Hire?"
        subheading="Tell us about the role. We'll have qualified candidates in front of you within 10 business days."
        primaryCTA={{ text: 'Start a Search', href: '/contact' }}
        secondaryCTA={{ text: 'Browse Our Services', href: '/services' }}
        background="gradient"
      />
    </>
  );
}
