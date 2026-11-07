/**
 * @license
 * Copyright (C) 2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { type Country, countries } from '../data/countries';

export type { Country };
export { countries };

// Pre-computed O(1) Lookup Maps
const countryByCodeMap = new Map<string, Country>();
const countriesByDialCodeMap = new Map<string, Country[]>();
const countryByDialCodePrimaryMap = new Map<string, Country>();

function normalizeDialCode(code: string): string {
  return code.replace(/[\s+]/g, '');
}

// Build indexes at module evaluation time
for (const country of countries) {
  // Index by uppercase ISO2
  countryByCodeMap.set(country.iso2.toUpperCase(), country);

  // Index by dial code
  const clean = normalizeDialCode(country.dialCode);
  const existing = countriesByDialCodeMap.get(clean) ?? [];
  existing.push(country);
  countriesByDialCodeMap.set(clean, existing);

  // Set primary country for dial code if not yet set
  if (!countryByDialCodePrimaryMap.has(clean)) {
    countryByDialCodePrimaryMap.set(clean, country);
  }
}

/**
 * Finds a country by its ISO2 code (e.g., 'IN', 'US').
 * Performs fast O(1) lookup. Case-insensitive.
 */
export function getCountryByCode(iso: string): Country | undefined {
  if (!iso || typeof iso !== 'string') return undefined;
  return countryByCodeMap.get(iso.toUpperCase().trim());
}

/**
 * Finds a primary country by its dial code (e.g., '+91', '91', '+1').
 * Performs fast O(1) lookup.
 */
export function getCountryByDialCode(dialCode: string): Country | undefined {
  if (!dialCode || typeof dialCode !== 'string') return undefined;
  const clean = normalizeDialCode(dialCode);
  return countryByDialCodePrimaryMap.get(clean);
}

/**
 * Retrieves all countries that share a given dial code (e.g. '+1' returns US, CA, PR, etc.).
 * Solves LOCALE-SEC-02 multi-country dial code collision.
 */
export function getCountriesByDialCode(dialCode: string): Country[] {
  if (!dialCode || typeof dialCode !== 'string') return [];
  const clean = normalizeDialCode(dialCode);
  return countriesByDialCodeMap.get(clean) ?? [];
}

/**
 * Retrieves comprehensive metadata for a country by its ISO2 code.
 */
export function getCountryMetadata(isoCode: string): Country | undefined {
  return getCountryByCode(isoCode);
}
