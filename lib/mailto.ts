import { COMPANY } from "./demo/data";

/**
 * A mailto: link to dispatch with the form contents pre-filled.
 *
 * GitHub Pages is static hosting with no server to receive a form, so forms
 * hand the message to the visitor's own email app instead of pretending to
 * have sent it. Empty values are dropped so the draft stays readable.
 */
export function dispatchMailto(subject: string, fields: [label: string, value: string | undefined][]): string {
  const body = fields
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Read a named/id'd field out of a submitted form. */
export function formValue(form: HTMLFormElement, id: string): string {
  const el = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${id}`);
  return el?.value ?? "";
}
