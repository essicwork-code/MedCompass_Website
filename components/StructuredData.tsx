import { SERVICES, SERVICE_AREA } from "@/lib/content";
import JsonLd from "./JsonLd";
import { COMPANY } from "@/lib/demo/data";
import { SITE_URL } from "@/lib/site";

/*
 * schema.org business data for search engines. Every value here must match
 * what the site displays and what the Google Business Profile lists; a
 * mismatched name, address or phone hurts local ranking rather than helping.
 */
export default function StructuredData() {
  const [locality, regionZip] = COMPANY.city.split(", ");
  const [region, postalCode] = regionZip.split(" ");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: COMPANY.name,
        description:
          "Non-emergency medical transportation (NEMT) and medical courier service in Chicago and the western and northern suburbs.",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/brand/medcompass-logo.png`,
        image: `${SITE_URL}/opengraph-image.jpg`,
        telephone: COMPANY.phoneHref,
        email: COMPANY.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: COMPANY.address,
          addressLocality: locality,
          addressRegion: region,
          postalCode,
          addressCountry: "US",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
        areaServed: SERVICE_AREA.map((name) => ({ "@type": "City", name: `${name}, IL` })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Transportation services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            url: `${SITE_URL}/services/${s.slug}/`,
            itemOffered: { "@type": "Service", name: s.name, description: s.short },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: s.fromPrice,
              minPrice: s.fromPrice,
              priceCurrency: "USD",
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: COMPANY.name,
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };

  return <JsonLd data={data} />;
}
