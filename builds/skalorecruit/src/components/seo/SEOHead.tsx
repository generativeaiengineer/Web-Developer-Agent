import { Helmet } from 'react-helmet-async';
import { SITE } from '@/lib/constants';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  schema?: object | object[];
  lcpImage?: string;
}

export function SEOHead({ title, description, canonical, ogImage, ogType = 'website', noindex = false, schema, lcpImage }: SEOHeadProps) {
  const fullTitle    = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const canonicalUrl = canonical ?? SITE.url;
  const image        = ogImage ?? `${SITE.url}${SITE.ogImage}`;
  const schemas      = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      {lcpImage && <link rel="preload" as="image" href={lcpImage} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
