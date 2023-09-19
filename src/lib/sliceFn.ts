/**
 * @param {string} str - string representation of a function
 * @param {[number, number]} boundaries - start and end position of the function body
 * @returns {[string, string, string]}
 */
export default function sliceFn(str, boundaries) {
  const before = str.slice(0, boundaries[0]);
  const body = str.slice(boundaries[0], boundaries[1]);
  const after = str.slice(boundaries[1]);
  return [before, body, after];
}
