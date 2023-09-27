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

/**
 * @example
 * // returns [3, 1, 2]
 * shuffle([1, 2, 3]);
 */
export function shuffle<T>(list: Array<T>): Array<T> {
  if (list.length === 0) {
    return [];
  }

  const i = Math.random() * list.length;
  const x = list.at(i)!;
  const xs = list.toSpliced(i, 1);
  return [x, ...shuffle(xs)];
}

export function pickOne<T>(list: Array<T>): T {
  const i = Math.random() * list.length;
  return list.at(i)!;
}

/**
 * Returns a list of numbers from "start" (inclusive) to "end" (exclusive).
 * @example
 * // returns [1,2,3]
 * range(1, 4);
 */
export function range(start: number, end: number): Array<number> {
  return Array.from({ length: Math.abs(end - start) }, (_, i) => start + i);
}
