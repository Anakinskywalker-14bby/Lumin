/** Single source of truth for site identity + structured data. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumin-pink.vercel.app";

export const SITE_NAME = "Lumin";

export const SITE_DESCRIPTION =
  "AI skin analysis for the modern age. One scan matches you with skincare from brands you already love. Join the beta.";

/** Organization schema — used on the homepage. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SITE_DESCRIPTION,
};

/** WebSite schema — used on the homepage. */
export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

/** BreadcrumbList schema for subpages. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
