import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { CompassMark } from "@/components/Logo";
import BookARideButton from "@/components/BookARideButton";
import { COMPANY } from "@/lib/demo/data";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-mist blur-3xl opacity-60"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <span className="animate-[spin_8s_linear_infinite] motion-reduce:animate-none">
            <CompassMark size={72} />
          </span>

          <p className="mt-8 font-display text-[5rem] font-extrabold leading-none tracking-tight text-deep sm:text-[6.5rem]">
            404
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.6rem,3.6vw,2.3rem)] font-extrabold leading-tight text-deep">
            This route doesn&rsquo;t exist on our map
          </h1>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-slate-soft">
            The page you&rsquo;re looking for was moved, renamed, or never existed. Dispatch is
            still on the road, though, so let&rsquo;s get you back on route.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-green px-7 py-3.5 text-[1rem] font-bold text-white shadow-sm transition-colors hover:bg-[#4d8f28]"
            >
              Back to home
            </Link>
            <BookARideButton className="inline-flex items-center rounded-full border-2 border-deep px-7 py-3.5 text-[1rem] font-bold text-deep transition-colors hover:bg-bone">
              Book a ride
            </BookARideButton>
          </div>

          <p className="mt-8 text-[0.92rem] text-slate-soft">
            Or call dispatch directly at{" "}
            <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-blue-ink hover:underline">
              {COMPANY.phone}
            </a>
          </p>

          <nav aria-label="Popular pages" className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-line pt-8 text-[0.92rem]">
            {[
              { href: "/services", label: "Services" },
              { href: "/pricing", label: "Pricing" },
              { href: "/service-area", label: "Service area" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold text-blue-ink hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </MarketingShell>
  );
}
