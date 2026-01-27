export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Marketing Tools Tracker",
    "description": "Discover 100+ AI marketing tools to automate content, optimize SEO, and skyrocket your revenue. Updated daily.",
    "url": "https://ai-market-tracker.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ai-market-tracker.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Market Tracker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ai-market-tracker.vercel.app/logo.png"
      }
    }
  };

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Marketing Tools",
    "description": "Curated list of the best AI-powered marketing tools",
    "numberOfItems": 100,
    "itemListElement": []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />
    </>
  );
}
