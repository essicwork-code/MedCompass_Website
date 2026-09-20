import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import Link from "next/link";
import { EmergencyNoticeBand } from "@/components/EmergencyNotice";
import MarketingShell from "@/components/MarketingShell";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import BookARideButton from "@/components/BookARideButton";
import AutoplayVideo from "@/components/AutoplayVideo";
import { COMPANY } from "@/lib/demo/data";
import { AREAS } from "@/lib/areas";
import { COMPARISON, SEGMENTS, SERVICES, SERVICE_AREA, STATS } from "@/lib/content";
import { asset } from "@/lib/asset";

const AREA_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(AREAS.map((a) => [a.name, a.slug]));

const SEGMENT_ACCENT: Record<string, string> = {
  families: "bg-green",
  hospitals: "bg-blue",
  dialysis: "bg-deep",
  snf: "bg-lime",
};

const SERVICE_ACCENT: Record<string, string> = {
  wheelchair: "bg-blue text-white",
  ambulatory: "bg-sky text-white",
  stretcher: "bg-green text-white",
  bariatric: "bg-deep text-white",
  courier: "bg-lime text-lime-ink",
};

export default function HomePage() {
  return (
    <MarketingShell>
      <>
        {/* ---- Hero ------------------------------------------------------ */}
        <section className="relative overflow-hidden bg-deep">
          {/* Route line: the signature motion moment, drawn once on load.
              Purely decorative — it depicts "a confirmed route," not a live
              vehicle, so it never contradicts the no-live-tracking claim. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            className="route-draw pointer-events-none absolute inset-0 h-full w-full opacity-70"
          >
            <defs>
              <linearGradient id="hero-route" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4da8da" />
                <stop offset="45%" stopColor="#5ca632" />
                <stop offset="100%" stopColor="#8dc63f" />
              </linearGradient>
            </defs>
            <path
              d="M -50 640 C 220 720, 340 420, 560 460 S 900 260, 1250 120"
              fill="none"
              stroke="url(#hero-route)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 14"
            />
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue/20 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1.5 text-[0.8rem] font-bold uppercase tracking-wider text-lime-ink">
                Chicagoland · Wheelchair · Stretcher · Bariatric · Courier
              </p>

              <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-white">
                The ride shows up.
                <br />
                <span className="text-lime">Every time.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[1.15rem] leading-relaxed text-white/80">
                With most transport companies, you help your mother into a van and then wait by a
                window hoping it shows up when it said it would. MedCompass runs on a
                different promise: a confirmed pickup window, a driver who calls ahead, and help
                from door to door on both ends of the trip, not just curb to curb.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <BookARideButton className="lift-on-hover inline-flex items-center rounded-full bg-lime px-7 py-3.5 text-[1rem] font-bold text-lime-ink shadow-[0_16px_40px_-16px_rgba(141,198,63,0.6)] hover:bg-lime-hover">
                  Book a ride
                </BookARideButton>
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="lift-on-hover inline-flex items-center rounded-full border-2 border-white/50 px-7 py-3.5 text-[1rem] font-bold text-white hover:border-white hover:bg-white/10"
                >
                  Call {COMPANY.phone}
                </a>
              </div>

              <p className="mt-6 text-[0.9rem] text-white/60">
                We bill Medicaid managed care and the major NEMT brokers directly. One escort
                always rides free.
              </p>
            </Reveal>

            <Reveal delay={150} className="relative">
              <div className="relative">
                <div className="lift-on-hover overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
                  <Image
                    src={asset(PHOTOS.homeHero.src)}
                    alt={PHOTOS.homeHero.alt}
                    width={PHOTOS.homeHero.width}
                    height={PHOTOS.homeHero.height}
                    className="h-auto w-full"
                    priority
                  />
                </div>

                <div className="absolute -bottom-8 -left-8 hidden w-44 overflow-hidden rounded-xl border-4 border-deep shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] sm:block">
                  <Image
                    src={asset(PHOTOS.homeSecure.src)}
                    alt={PHOTOS.homeSecure.alt}
                    width={PHOTOS.homeSecure.width}
                    height={PHOTOS.homeSecure.height}
                    className="h-auto w-full"
                  />
                </div>

                <div className="absolute -top-6 -right-4 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.4)] sm:right-6">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-green opacity-70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
                  </span>
                  <p className="text-[0.85rem] font-bold leading-tight text-deep">
                    Dispatch
                    <br />
                    staffed 24/7
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Emergency notice ------------------------------------------- */}
        <EmergencyNoticeBand />

        {/* ---- Proof bar -------------------------------------------------- */}
        <section aria-label="Company statistics" className="border-y border-line bg-white">
          <div className="route-gradient h-1" aria-hidden="true" />
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} as="div" className="flex flex-col-reverse lg:px-6 lg:first:pl-0">
                <dt className="mt-1.5 text-[0.92rem] text-slate-soft">{s.label}</dt>
                <dd className="font-display text-[2.6rem] font-extrabold leading-none text-deep">
                  <StatCounter value={s.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* ---- Warm intro ------------------------------------------------- */}
        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-[1.1fr_1fr]">
            <Reveal className="overflow-hidden rounded-2xl">
              <Image
                src={asset(PHOTOS.stretcherLoading.src)}
                alt={PHOTOS.stretcherLoading.alt}
                width={PHOTOS.stretcherLoading.width}
                height={PHOTOS.stretcherLoading.height}
                className="h-auto w-full"
                loading="lazy"
              />
            </Reveal>

            <Reveal delay={120}>
              <h2 className="font-display text-[clamp(2rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] text-deep">
                Getting to an appointment should be the easy part.
              </h2>
              <p className="mt-5 text-[1.08rem] leading-relaxed text-slate-soft">
                For a lot of families, it is the hardest part. A parent who cannot drive anymore. A
                wheelchair that will not fit in anyone&rsquo;s car. A dialysis schedule that does
                not move, three days a week, no matter what else is going on that week.
              </p>
              <p className="mt-4 text-[1.08rem] leading-relaxed text-slate-soft">
                That is the whole job for us. We show up when we said we would, we help your person
                from their door to the right desk instead of leaving them at a curb, and we keep
                you in the loop the entire way.
              </p>

              <ul className="mt-8 space-y-3.5">
                {[
                  "Door through door, not curb to curb",
                  "The same driver on standing orders wherever we can manage it",
                  "One escort rides free on every trip",
                  "Drivers are employees, background checked and CPR certified",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[1.02rem] text-ink">
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 rounded-full bg-moss p-1 text-moss-ink"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---- Film ------------------------------------------------------- */}
        <section className="bg-deep py-20">
          <div className="mx-auto max-w-5xl px-4">
            <Reveal className="max-w-2xl">
              <p className="text-[0.82rem] font-bold uppercase tracking-widest text-lime">
                See a ride
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] font-extrabold leading-tight text-white">
                A pickup, start to finish.
              </h2>
            </Reveal>
            {/*
              Plays itself while it is on screen and pauses when it scrolls
              away. It starts muted because browsers require that for autoplay,
              with a button to turn the sound on, and holds still for anyone
              who asked their system for reduced motion. See AutoplayVideo.
            */}
            <Reveal delay={120} className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <AutoplayVideo
                src="/video/medcompass-brand.mp4"
                poster="/video/brand-poster.webp"
                width={1280}
                height={720}
                label="This video shows a MedCompass driver picking a rider up at her door and helping her into the van, then the fleet ready at the garage."
              />
            </Reveal>
          </div>
        </section>

        {/* ---- Services --------------------------------------------------- */}
        <section className="bg-bone py-24">
          <div className="mx-auto max-w-7xl px-4">
            <Reveal className="max-w-2xl">
              <p className="text-[0.82rem] font-bold uppercase tracking-widest text-green">
                What we run
              </p>
              <h2 className="mt-2 font-display text-[clamp(2rem,3.6vw,2.9rem)] font-extrabold leading-tight text-deep">
                Five services. The price is on the page.
              </h2>
              <p className="mt-4 text-[1.08rem] leading-relaxed text-slate-soft">
                Every service below lists a base rate and a per-mile rate. You will not find out
                what it costs at the curb.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {SERVICES.map((s, i) => (
                <Reveal key={s.slug} as="li" delay={i * 70} className="h-full">
                  <Link
                    href={`/services/${s.slug}`}
                    className="lift-on-hover group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 hover:shadow-[0_20px_50px_-24px_rgb(16_34_46/0.45)]"
                  >
                    <span className="route-gradient absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
                    {s.slug === "courier" && (
                      <span className="absolute right-4 top-5 rounded-full bg-moss px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-moss-ink">
                        New
                      </span>
                    )}
                    <span
                      className={`mt-1.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${SERVICE_ACCENT[s.slug] ?? "bg-blue text-white"}`}
                    >
                      <ServiceIcon kind={s.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-display text-[1.12rem] font-bold text-deep">{s.name}</h3>
                    <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-slate-soft">
                      {s.short}
                    </p>
                    <p className="tabular mt-5 border-t border-line pt-4 text-[0.88rem] text-slate-soft">
                      From <span className="font-bold text-deep">${s.fromPrice}</span> + $
                      {s.perMile.toFixed(2)}/mi
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-blue-ink">
                      What&rsquo;s included
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- How we compare ---------------------------------------------- */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="max-w-2xl">
              <p className="text-[0.82rem] font-bold uppercase tracking-widest text-blue-ink">
                Why switch
              </p>
              <h2 className="mt-2 font-display text-[clamp(2rem,3.6vw,2.9rem)] font-extrabold leading-tight text-deep">
                Most NEMT sites ask you to call and hope.
              </h2>
              <p className="mt-4 text-[1.08rem] leading-relaxed text-slate-soft">
                We publish the numbers a comparison-shopping family or a discharge planner actually
                needs, up front, instead of behind a phone call.
              </p>
            </Reveal>

            <Reveal className="mt-12 overflow-hidden rounded-2xl border border-line">
              <div className="grid grid-cols-1 divide-y divide-line">
                <div className="hidden bg-deep px-6 py-4 text-[0.85rem] font-bold uppercase tracking-wide text-white/85 sm:grid sm:grid-cols-[1.2fr_1fr_1fr]">
                  <span>What matters</span>
                  <span className="text-lime">MedCompass</span>
                  <span className="text-white/60">Most other providers</span>
                </div>
                {COMPARISON.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-1 gap-3 bg-white px-6 py-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-0"
                  >
                    <p className="font-semibold text-deep">{row.feature}</p>
                    <p className="flex items-start gap-2 text-[0.95rem] text-ink">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {row.us}
                    </p>
                    <p className="flex items-start gap-2 text-[0.95rem] text-slate-soft">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-soft/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      {row.them}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---- Segments --------------------------------------------------- */}
        <section className="bg-bone py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
              <Reveal className="lg:sticky lg:top-32">
                <p className="text-[0.82rem] font-bold uppercase tracking-widest text-green">
                  Who calls us
                </p>
                <h2 className="mt-2 font-display text-[clamp(2rem,3.6vw,2.9rem)] font-extrabold leading-tight text-deep">
                  Different people call for different reasons.
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-slate-soft">
                  A daughter wants to know her mother got there. A discharge planner needs the bed
                  back. A dialysis coordinator needs the chair to turn on time. We built for each
                  of them instead of averaging everyone into one word.
                </p>
                <div className="mt-8 overflow-hidden rounded-2xl">
                  <Image
                    src={asset(PHOTOS.clinicHandoff.src)}
                    alt={PHOTOS.clinicHandoff.alt}
                    width={PHOTOS.clinicHandoff.width}
                    height={PHOTOS.clinicHandoff.height}
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>

              <ul className="grid gap-5 sm:grid-cols-2">
                {SEGMENTS.map((seg, i) => (
                  <Reveal
                    key={seg.id}
                    as="li"
                    delay={i * 80}
                    id={seg.id}
                    className="relative overflow-hidden rounded-2xl border border-line bg-white p-7"
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-1.5 ${SEGMENT_ACCENT[seg.id] ?? "bg-blue"}`}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-[1.22rem] font-bold text-deep">{seg.name}</h3>
                    <p className="mt-3 border-l-3 border-line pl-4 text-[0.98rem] italic leading-relaxed text-slate-soft">
                      {seg.pain}
                    </p>
                    <p className="mt-4 text-[0.98rem] leading-relaxed text-ink">{seg.answer}</p>
                    <p className="tabular mt-4 inline-block rounded-full bg-moss px-3 py-1.5 text-[0.85rem] font-semibold text-moss-ink">
                      {seg.proof}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---- Service area ----------------------------------------------- */}
        <section className="mx-auto max-w-7xl px-4 py-24">
          <Reveal className="overflow-hidden rounded-2xl border border-line bg-white p-8 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold leading-tight text-deep">
                  {SERVICE_AREA.length} communities, one dispatch desk
                </h2>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-slate-soft">
                  Chicago proper plus the western and northern suburbs, with scheduled longer runs
                  into southeastern Wisconsin. If you do not see your town, call us anyway. We
                  quote trips outside the area rather than turning them away.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6">
                  <Link
                    href="/service-area"
                    className="inline-flex min-h-11 items-center gap-2 font-bold text-blue-ink hover:underline"
                  >
                    Open the coverage map →
                  </Link>
                  <Link
                    href="/areas"
                    className="inline-flex min-h-11 items-center gap-2 font-bold text-blue-ink hover:underline"
                  >
                    Prices by town →
                  </Link>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2 self-start">
                {SERVICE_AREA.map((town) => {
                  const slug = AREA_SLUG_BY_NAME[town];
                  return slug ? (
                    <li key={town}>
                      <Link
                        href={`/areas/${slug}/`}
                        className="inline-flex min-h-11 items-center rounded-full border border-blue/40 bg-white px-3.5 text-[0.88rem] font-semibold text-blue-ink hover:bg-mist"
                      >
                        {town}
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={town}
                      className="inline-flex min-h-11 items-center rounded-full border border-line bg-bone px-3.5 text-[0.88rem] text-slate-soft"
                    >
                      {town}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ---- Closing CTA ------------------------------------------------ */}
        <section className="relative overflow-hidden bg-deep">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 route-gradient opacity-10"
          />
          <Reveal className="relative mx-auto max-w-4xl px-4 py-24 text-center">
            <h2 className="font-display text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold leading-tight text-white">
              Book the ride. Then get on with your day.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-white/75">
              A quote takes about a minute. You do not need an account to see a price, and there is
              no card until the trip is confirmed.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <BookARideButton className="lift-on-hover inline-flex items-center rounded-full bg-lime px-8 py-4 text-[1.02rem] font-bold text-lime-ink hover:bg-lime-hover">
                Get a quote
              </BookARideButton>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="lift-on-hover inline-flex items-center rounded-full border-2 border-white/40 px-8 py-4 text-[1.02rem] font-bold text-white hover:bg-white/10"
              >
                Call dispatch
              </a>
            </div>
          </Reveal>
        </section>
      </>
    </MarketingShell>
  );
}
