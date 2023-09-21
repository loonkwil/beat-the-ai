/**
 * It is like the Array.prototype.some function but works with any iterable
 *
 * @example
 * // returns false
 * some([1, 2, 3], (n) => n > 4);
 */
export function some<T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean,
): boolean {
  for (const item of iterable) {
    if (predicate(item)) {
      return true;
    }
  }
  return false;
}

/**
 * @example
 * // returns 3
 * countWhile([1, 2, 3, 4, 5], (n) => n % 2)
 */
export function countWhile<T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean,
): number {
  let i = 0;
  for (const item of iterable) {
    if (!predicate(item)) {
      return i;
    }
    i += 1;
  }

  return i;
}

export function shuffle(arr: Array<unknown>): Array<unknown> {
  if (arr.length === 0) {
    return [];
  }

  const i = Math.floor(Math.random() * arr.length);
  const x = arr[i];
  const xs = arr.toSpliced(i, 1);
  return [x, ...shuffle(xs)];
}
