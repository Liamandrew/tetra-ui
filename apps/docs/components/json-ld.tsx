import { siteConfig } from "@/lib/config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  author: {
    "@type": "Person",
    name: "Liam Andrew",
    url: siteConfig.links.twitter,
  },
  description: siteConfig.description,
  name: siteConfig.name,
  operatingSystem: "iOS, Android",
  sameAs: [siteConfig.links.github, siteConfig.links.twitter],
  url: siteConfig.url,
};

export function JsonLd() {
  const serialized = JSON.stringify(jsonLd).replaceAll("<", "\\u003c");

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be a raw JSON text node
      dangerouslySetInnerHTML={{ __html: serialized }}
      type="application/ld+json"
    />
  );
}
