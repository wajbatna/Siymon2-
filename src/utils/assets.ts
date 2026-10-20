/**
 * Resolve a path inside `public/` to a URL that respects the configured
 * Vite base path (important for GitHub Pages project sites).
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
