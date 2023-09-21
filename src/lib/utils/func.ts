/**
 * Get the body of a function (and the text before and after it).
 *
 * @example
 * // returns ['function() {', ' console.log(1); ', '}']
 * slice('function() { console.log(1); }', [12, -1]);
 */
export function slice(
  str: string,
  boundaries: [number, number],
): [string, string, string] {
  const before = str.slice(0, boundaries[0]);
  const body = str.slice(boundaries[0], boundaries[1]);
  const after = str.slice(boundaries[1]);
  return [before, body, after];
}
