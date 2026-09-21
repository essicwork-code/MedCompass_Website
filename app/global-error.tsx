"use client";

import { COMPANY } from "@/lib/demo/data";

/*
 * The last line of defence: an error in the root layout itself, where
 * app/error.tsx cannot help because the layout that renders it is the thing
 * that broke. This replaces the whole document, so it ships its own <html>
 * and its own styles rather than trusting anything that failed to load.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem 1rem",
          background: "#f6f9fb",
          color: "#10222e",
          font: "16px/1.6 ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.6rem", lineHeight: 1.2, color: "#0f4c75", margin: 0 }}>
            This page didn&rsquo;t load
          </h1>
          <p style={{ marginTop: "1rem", color: "#5a7183" }}>
            Dispatch is staffed 24/7 and nothing you typed was sent anywhere. Call us and we will
            book the ride over the phone.
          </p>
          <p style={{ marginTop: "1.75rem" }}>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                padding: "0 1.75rem",
                borderRadius: 999,
                background: "#448023",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Call {COMPANY.phone}
            </a>
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                padding: "0 1.5rem",
                borderRadius: 999,
                border: "2px solid #0f4c75",
                background: "transparent",
                color: "#0f4c75",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </p>
        </main>
      </body>
    </html>
  );
}
