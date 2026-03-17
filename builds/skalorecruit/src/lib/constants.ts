export const SITE = {
  name: 'SkaloRecruit',
  url: 'https://skalorecruit.com',
  description: 'Premium recruitment agency connecting exceptional talent with leading employers across finance, technology, and professional services.',
  email: 'hello@skalorecruit.com',
  phone: '+44 20 7946 0958',
  address: '30 St Mary Axe, London, EC3A 8BF',
  social: {
    linkedin: 'https://linkedin.com/company/skalorecruit',
    twitter: '',
    instagram: '',
    facebook: '',
  },
  ogImage: '/og-default.jpg',
} as const;

export const NAV_LINKS = [
  { label: 'For Employers', href: '/services' },
  { label: 'For Candidates', href: '/candidates' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/about' },
  { label: 'Jobs', href: '/jobs' },
] as const;
