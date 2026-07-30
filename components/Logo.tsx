import Image from "next/image";

/*
 * Assets are generated from the source artwork in /Assets by
 * scripts/prepare-assets.mjs — re-run that after replacing the originals.
 *
 * The supplied lockup is stacked (mark above wordmark), which is too tall for a
 * site header, so headers pair the extracted mark with a text wordmark. The
 * full lockup is used where there is vertical room.
 */

export function CompassMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/compass-mark.png"
      alt=""
      width={size}
      height={Math.round(size * 0.8)}
      className={className}
      priority
    />
  );
}

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <CompassMark size={44} />
      <span className="font-display text-[1.4rem] font-extrabold leading-none tracking-[-0.03em]">
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
      src="/brand/medcompass-logo.png"
      alt="MedCompass"
      width={width}
      height={Math.round(width * 0.8)}
      className={className}
    />
  );
}
