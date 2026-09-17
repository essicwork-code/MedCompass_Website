/** Current local time in the "YYYY-MM-DDTHH:mm" shape a datetime-local input uses. */
export function nowForDateTimeInput(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
