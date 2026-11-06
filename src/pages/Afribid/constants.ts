export const DEMO_VERSION = 11;
export const STORAGE_KEY = 'afribid-v11';
export const ASSET_BASE = '/afribid/assets';
export const DOCS_FEE = 15000;
export const SERVICE_RATE = 0.05;
export const ANTI_SNIPE_MS = 120000;
export const BID_STEP_MULTIPLIERS = [1, 2, 3] as const;

export const COUNTRIES = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Rwanda',
  'Ghana',
  'Senegal',
  'Nigeria',
  'South Africa',
  'Morocco',
  'Egypt',
];

export const TIMEZONES = [
  'UTC',
  'Africa/Nairobi',
  'Africa/Accra',
  'Africa/Dakar',
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Europe/Paris',
];

export const PHOTO_MAP: Record<string, string> = {
  'reference-hilux': 'hilux-front.jpg',
  'hilux-front.jpg': 'hilux-front.jpg',
  'hilux-rear.jpg': 'hilux-rear.jpg',
  'hilux-side.jpg': 'hilux-side.jpg',
  'hilux-interior.jpg': 'hilux-interior.jpg',
  'fortuner.jpg': 'fortuner.jpg',
  'mercedes.jpg': 'mercedes.jpg',
  'navara.jpg': 'navara.jpg',
  'home-fortuner-banner.png': 'home-fortuner-banner.png',
  'home-hilux-banner.png': 'home-hilux-banner.png',
  'home-mercedes-banner.png': 'home-mercedes-banner.png',
  'home-reference.png': 'home-reference.png',
  'afribid-film-poster.png': 'afribid-film-poster.png',
};

export function assetUrl(name: string): string {
  const file = PHOTO_MAP[name] || name;
  return `${ASSET_BASE}/${file}`;
}

/** Format cents integer as USD display string without currency symbol wrapper. */
export function money(cents: number | null | undefined): string {
  if (cents == null) return 'Price on request';
  return (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function moneyLabel(cents: number | null | undefined): string {
  if (cents == null) return 'Price on request';
  return `USD ${money(cents)}`;
}

export function vehicleName(v: {
  year: number;
  make: string;
  model: string;
}): string {
  return `${v.year} ${v.make} ${v.model}`;
}

export function afribidPath(hashRoute: string): string {
  const cleaned = hashRoute.replace(/^#/, '');
  return `/afribid/${cleaned}`;
}
