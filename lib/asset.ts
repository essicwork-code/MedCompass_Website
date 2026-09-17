/**
 * Prefix a /public path with the deploy base path.
 *
 * next/link and _next assets get basePath automatically, but a plain string
 * handed to next/image (with `unoptimized`) does not — on a GitHub Pages
 * project site "/photos/x.jpg" would 404 without the "/<repo>" prefix.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
