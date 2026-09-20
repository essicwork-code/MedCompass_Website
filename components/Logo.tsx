import Image from "next/image";
import { asset } from "@/lib/asset";

/*
 * Assets are generated from the source artwork in /Assets by
 * scripts/prepare-assets.mjs — re-run that after replacing the originals.
 *
 * The supplied lockup is stacked (mark above wordmark), which is too tall for a
 * site header, so headers pair the extracted mark with a text wordmark. The
 * full lockup is used where there is vertical room.
 */

/** Actual pixel ratio of compass-mark.png (320x258). Keep width/height props in sync with this. */
const MARK_RATIO = 320 / 258;

export function CompassMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={asset("/brand/compass-mark.png")}
      alt=""
      width={size}
      height={Math.round(size / MARK_RATIO)}
      // Constrain height only and let width track it (w-auto). Constraining
      // both independently, e.g. h-8 w-8, would squash this non-square mark.
      className={className ?? "h-9 w-auto"}
      priority
    />
  );
}

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className ?? ""}`}>
      <CompassMark size={44} className="h-8 w-auto shrink-0 sm:h-11" />
      {/* Mark plus wordmark on one baseline — the same two-tone split the
          supplied lockup uses, so header and artwork read as one name. */}
      <span className="font-display text-[1.22rem] font-extrabold leading-none tracking-[-0.03em] sm:text-[1.5rem]">
        <span className={invert ? "text-sky" : "text-blue"}>Med</span>
        <span className={invert ? "text-lime" : "text-green"}>Compass</span>
      </span>
    </span>
  );
}

/** Full supplied lockup, for hero and print-style contexts. */
export function LogoLockup({ width = 260, className }: { width?: number; className?: string }) {
  return (
    <Image
      src={asset("/brand/medcompass-logo.png")}
      alt="MedCompass"
      width={width}
      height={Math.round(width * 0.8)}
      className={className}
    />
  );
}
