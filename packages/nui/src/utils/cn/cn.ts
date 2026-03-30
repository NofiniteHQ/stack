/**
 * Represents a dictionary of class names where the key is the class string
 * and the value is a boolean (or nullish) indicating if it should be applied.
 */
type ClassDictionary = Record<string, boolean | undefined | null>;

/**
 * A recursive type representing the valid inputs for the cn utility.
 * Accepts strings, numbers, booleans, null/undefined, dictionaries, or an array of these.
 */
export type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | ClassDictionary 
  | ClassValue[]; 

/**
 * Conditionally joins class names together into a single string.
 * Evaluates objects for truthy values and recursively flattens nested arrays.
 * * @param inputs - A variadic list of class values to evaluate and merge.
 * @returns A space-separated string of the active class names.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    // 1. Skip falsy values (false, null, undefined, '')
    if (!input) continue;

    // 2. Handle flat strings and numbers
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(input.toString());
    } 
    // 3. Handle arrays recursively
    else if (Array.isArray(input)) {
      if (input.length) {
        // Recursive call handles nested arrays (e.g., [['rounded']])
        const inner = cn(...input);
        if (inner) classes.push(inner);
      }
    } 
    // 4. Handle object dictionaries
    else if (typeof input === 'object') {
      for (const key in input) {
        // Strict check to satisfy TypeScript
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}