"use client";

import { useBookingModal } from "./BookingModalProvider";

/**
 * Thin client wrapper around useBookingModal(), so server-component pages
 * (metadata exports, etc.) can drop a "Book a ride" / "Get a quote" trigger
 * in without themselves becoming client components.
 */
export default function BookARideButton({
  serviceSlug,
  className,
  children,
}: {
  /** A SERVICES slug (lib/content.ts) to pre-select in the modal, if relevant here. */
  serviceSlug?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useBookingModal();
  return (
    <button
      type="button"
      onClick={() => open(serviceSlug ? { serviceSlug } : undefined)}
      className={className}
    >
      {children}
    </button>
  );
}
