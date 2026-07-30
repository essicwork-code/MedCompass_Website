import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroTracker from "@/components/HeroTracker";
import ServiceIcon from "@/components/ServiceIcon";
import { COMPANY } from "@/lib/demo/data";
import { SEGMENTS, SERVICES, SERVICE_AREA, STATS, TESTIMONIALS } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---- Hero ------------------------------------------------------ */}
        <section className="relative overflow-hidden bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-mist blur-3xl opacity-60"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-moss px-3.5 py-1.5 text-[0.8rem] font-bold uppercase tracking-wider text-[#3f7f22]">
                Chicagoland · Wheelchair · Stretcher · Bariatric
              </p>

              <h1 className="mt-5 font-display text-[clamp(2.3rem,5.6vw,4rem)] font-extrabold leading-[1.03] text-deep">
                Know exactly where your ride is.
              </h1>

              <p className="mt-5 max-w-xl text-[1.12rem] leading-relaxed text-slate-soft">
                Most medical transport asks you to book a van and then wait by a window.
                MedCompass gives every trip a live map, a driver name, and an arrival time you
                can watch count down — for the rider, and for whoever is worrying about them.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center rounded-full bg-green px-7 py-3.5 text-[1rem] font-bold text-white shadow-sm transition-colors hover:bg-[#4d8f28]"
                >
                  Book a ride
                </Link>
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="inline-flex items-center rounded-full border-2 border-deep px-7 py-3.5 text-[1rem] font-bold text-deep transition-colors hover:bg-bone"
                >
                  Call {COMPANY.phone}
                </a>
              </div>

              <p className="mt-5 text-[0.9rem] text-slate-soft">
                Medicaid managed care and major NEMT brokers billed directly · One escort rides
                free
              </p>
            </div>

            <HeroTracker />
          </div>
        </section>

        {/* ---- Proof bar -------------------------------------------------- */}
        <section aria-label="Company statistics" className="border-y border-line bg-deep">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="tabular block font-display text-[2rem] font-extrabold leading-none text-lime">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-[0.9rem] text-white/75">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- Services --------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-deep">
              Four levels of transport, priced before you book
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-soft">
              Every service below has a published base rate and per-mile rate. You will not get a
              surprise number at the curb.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_14px_40px_-20px_rgb(16_34_46/0.4)]"
                >
                  <span className="text-blue">
                    <ServiceIcon kind={s.icon} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.2rem] font-bold text-deep">{s.name}</h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-slate-soft">
                    {s.short}
                  </p>
                  <p className="tabular mt-5 border-t border-line pt-4 text-[0.9rem] text-slate-soft">
                    From <span className="font-bold text-deep">${s.fromPrice}</span> + $
                    {s.perMile.toFixed(2)}/mi
                  </p>
                  <span className="mt-3 text-[0.9rem] font-semibold text-blue group-hover:underline">
                    What&rsquo;s included →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- The differentiator ---------------------------------------- */}
        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-line">
              <Image
                src="/brand/van-side.jpg"
                alt="A MedCompass wheelchair-accessible RAM ProMaster van, marked with USDOT and MC numbers"
                width={1156}
                height={419}
                className="h-auto w-full"
              />
            </div>

            <div>
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-deep">
                The part everyone else leaves out
              </h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-soft">
                Booking a ride is the easy half. The hard half is the ninety minutes afterward,
                when nobody will tell you where the van is. We built the tracking first and the
                brochure second.
              </p>

              <ul className="mt-8 space-y-5">
                {[
                  {
                    t: "A link, not an app",
                    d: "Tracking arrives by text. It opens in any browser, on any phone, for anyone you forward it to — no account, no download.",
                  },
                  {
                    t: "The driver's name before the knock",
                    d: "You see who is coming, how long they have driven for us, and the unit number on the van, before they reach the door.",
                  },
                  {
                    t: "Alerts at the moments that matter",
                    d: "Driver assigned, driver arriving, rider on board, rider delivered. Four messages, no noise in between.",
                  },
                  {
                    t: "Private by construction",
                    d: "The link shows a van and an ETA. It never carries a name, a condition, or the name of the clinic — so forwarding it to family leaks nothing.",
                  },
                ].map((item) => (
                  <li key={item.t} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-green"
                    />
                    <div>
                      <h3 className="font-display text-[1.05rem] font-bold text-deep">{item.t}</h3>
                      <p className="mt-1 text-[0.97rem] leading-relaxed text-slate-soft">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/track"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-blue px-6 py-3 font-bold text-blue hover:bg-mist"
              >
                See a live trip →
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Segments --------------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-tight text-deep">
            Built around who is actually making the call
          </h2>

          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {SEGMENTS.map((seg) => (
              <li
                key={seg.id}
                id={seg.id}
                className="rounded-2xl border border-line bg-white p-7"
              >
                <h3 className="font-display text-[1.25rem] font-bold text-deep">{seg.name}</h3>
                <p className="mt-3 border-l-3 border-line pl-4 text-[0.98rem] italic leading-relaxed text-slate-soft">
                  {seg.pain}
                </p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink">{seg.answer}</p>
                <p className="tabular mt-4 inline-block rounded-full bg-moss px-3 py-1.5 text-[0.85rem] font-semibold text-[#3f7f22]">
                  {seg.proof}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Testimonials ----------------------------------------------- */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold text-deep">
              What families tell us
            </h2>
            <ul className="mt-10 grid gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <li key={t.name} className="rounded-2xl border border-line bg-bone p-7">
                  <blockquote className="text-[1rem] leading-relaxed text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-5 border-t border-line pt-4">
                    <p className="font-semibold text-deep">{t.name}</p>
                    <p className="text-[0.88rem] text-slate-soft">{t.role}</p>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- Service area ----------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="rounded-2xl border border-line bg-white p-8 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <h2 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-tight text-deep">
                  {SERVICE_AREA.length} communities, one dispatch desk
                </h2>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-slate-soft">
                  Chicago proper plus the western and northern suburbs, with scheduled
                  long-distance runs into southeastern Wisconsin. Outside the list? Call dispatch —
                  we quote out-of-area trips individually rather than refusing them.
                </p>
                <Link
                  href="/service-area"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-blue hover:underline"
                >
                  Open the coverage map →
                </Link>
              </div>

              <ul className="flex flex-wrap gap-2 self-start">
                {SERVICE_AREA.map((town) => (
                  <li
                    key={town}
                    className="rounded-full border border-line bg-bone px-3 py-1.5 text-[0.85rem] text-slate-soft"
                  >
                    {town}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---- Closing CTA ------------------------------------------------ */}
        <section className="bg-deep">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-tight text-white">
              Book the ride. Then actually watch it happen.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-white/75">
              Quote in under a minute. No account needed to get a price, and no card required
              until the trip is confirmed.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="inline-flex items-center rounded-full bg-lime px-8 py-4 text-[1.02rem] font-bold text-[#22400f] hover:bg-[#9ed352]"
              >
                Get a quote
              </Link>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="inline-flex items-center rounded-full border-2 border-white/40 px-8 py-4 text-[1.02rem] font-bold text-white hover:bg-white/10"
              >
                Call dispatch
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
