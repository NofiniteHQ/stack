/**
 * @license
 * Copyright (C) 2025 Nofinite
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

import {type Country, countries } from "./data/countries";

/**
 * Finds a country by its ISO2 code (e.g., 'IN', 'US').
 * Case-insensitive.
 */
export const getCountryByCode = (iso: string): Country | undefined => {
  if (!iso) return undefined;
  return countries.find(c => c.iso2.toUpperCase() === iso.toUpperCase());
};

/**
 * Finds a country by its dial code (e.g., '+91', '91').
 * Handles inputs with or without the '+' prefix.
 */
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  if (!dialCode) return undefined;
  
  // Normalize input: remove spaces and '+' to ensure matching works
  const cleanCode = dialCode.replace(/[\s+]/g, '');
  
  return countries.find(c => {
    const cleanCountryCode = c.dialCode.replace(/[\s+]/g, '');
    return cleanCountryCode === cleanCode;
  });
};