import Link from "next/link";
import JsonLd from "./JsonLd";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  label: string;
  /** Site path with trailing slash; the last crumb (the current page) may omit it. */
  href?: string;
}

/** Visible trail plus the matching BreadcrumbList, so the two can't drift apart. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-white">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 text-[0.88rem] text-slate-soft">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.label} className="flex items-center gap-2">
                {last || !c.href ? (
                  <span aria-current={last ? "page" : undefined} className="flex min-h-11 items-center font-semibold text-deep">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="flex min-h-11 min-w-11 items-center hover:text-blue-ink hover:underline">
                    {c.label}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
