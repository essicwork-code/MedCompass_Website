"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import BookingModal from "./BookingModal";

export interface BookingModalPrefill {
  /** A SERVICES slug (lib/content.ts) to pre-select in the service picker. */
  serviceSlug?: string;
  /** Trip details already chosen elsewhere (the /book wizard), so they aren't asked twice. */
  trip?: Partial<{
    pickup: string;
    dropoff: string;
    when: string;
    roundTrip: boolean;
    escort: boolean;
    stat: boolean;
    notes: string;
  }>;
}

interface BookingModalContextValue {
  open: (prefill?: BookingModalPrefill) => void;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

/** Every "Book a ride" / "Get a quote" CTA site-wide calls this instead of navigating to /book. */
export function useBookingModal(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return ctx;
}

/**
 * Mounted once near the root (see MarketingShell) so the modal — and the
 * `useBookingModal` hook that opens it — is available to every page,
 * including the sticky header's CTA.
 */
export default function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingModalPrefill>({});

  const open = useCallback((next?: BookingModalPrefill) => {
    setPrefill(next ?? {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModal isOpen={isOpen} onClose={close} serviceSlug={prefill.serviceSlug} trip={prefill.trip} />
    </BookingModalContext.Provider>
  );
}
