import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ChatWidget from "./ChatWidget";
import BookingModalProvider from "./BookingModalProvider";

/**
 * Chrome shared by every public page: header, footer, chat, and the booking
 * modal provider — mounted here (rather than app/layout.tsx) so it's
 * available wherever MarketingShell wraps a page, including the header's
 * "Book a ride" CTA, without pulling client-only context into the root
 * server layout.
 */
export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <BookingModalProvider>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </BookingModalProvider>
  );
}

/** Standard inner-page header. Keeps the many content pages visually consistent. */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
        {eyebrow && (
          <p className="text-[0.82rem] font-bold uppercase tracking-widest text-green-ink">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1.06] text-deep">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-slate-soft">{lede}</p>
        )}
      </div>
    </section>
  );
}
