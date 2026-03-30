/**
 * Generates a unique, alphanumeric identifier with a specific prefix.
 * Useful for linking DOM elements (e.g., matching a <label> to an <input>).
 *
 * @param prefix - The string to prepend to the generated random string.
 * @returns A unique identifier string in the format `prefix-xxxxxx`.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}