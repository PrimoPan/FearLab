import { extname } from 'node:path';

// Keep this site's objects isolated from the other applications in the shared bucket.
export const STATIC_IMAGE_PREFIX = 'fearlab/';

const imageTypes = {
  '.avif': 'image/avif', '.bmp': 'image/bmp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.tif': 'image/tiff',
  '.tiff': 'image/tiff', '.webp': 'image/webp'
};

export function imageMime(path) {
  return imageTypes[extname(path.replace(/[?#].*$/, '')).toLowerCase()];
}

// Vite expects decoded URLs and performs the final escaping for HTML/CSS/JS.
// https://vite.dev/guide/build.html#advanced-base-options
export function imageBaseUrl(value) {
  if (!value?.trim()) return undefined;
  const invalid = () => new Error('FEARLAB_IMAGE_BASE_URL must be an HTTPS URL without credentials, query, or fragment.');
  let url, path;
  try {
    url = new URL(value.trim());
    path = decodeURIComponent(url.pathname);
  } catch { throw invalid(); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || /[?#\\]/.test(path)) throw invalid();
  return `${url.origin}${path.replace(/\/+$/, '')}/`;
}

export function imageBaseUrlFromEnvironment() {
  return imageBaseUrl(process.env.FEARLAB_IMAGE_BASE_URL);
}
