import { SITE } from '@/lib/constants';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'customer service',
    },
    sameAs: Object.values(SITE.social).filter(Boolean),
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/jobs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildWebPageSchema(props: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.name,
    description: props.description,
    url: props.url,
    isPartOf: { '@type': 'WebSite', url: SITE.url },
  };
}

export function buildServiceSchema(props: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    description: props.description,
    url: props.url,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function buildFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}
