/**
 * Retrieves the computed value of a NUI CSS theme variable from the document.
 * @param category The theme category (e.g. 'color', 'bg', 'text')
 * @param key The specific token key (e.g. 'primary', 'default')
 * @param fallback Optional fallback value if the variable isn't found
 * @returns The resolved CSS value (e.g. '#2563eb')
 */
export function getThemeValue(category: string, key: string, fallback?: string): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback || '';
  }
  
  const varName = `--${category}-${key}`;
  const root = document.documentElement;
  
  // getComputedStyle can be expensive if called in a tight loop, 
  // but it's required to get the active CSS variable value natively.
  const value = getComputedStyle(root).getPropertyValue(varName).trim();
  
  return value || fallback || '';
}
