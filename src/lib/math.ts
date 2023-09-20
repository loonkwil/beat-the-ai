/**
 * @example
 * multiply(2, 3); // -> 6
 * multiply([0, 1], -1); // -> [0, -1]
 * multiply([[1, 2], [3, 4]], 2); // -> [[2, 4], [6, 8]]
 */
export function multiply<T extends Array<T | number>>(
  vector: T,
  scalar: number,
): T {
  return vector.map((item) =>
    Array.isArray(item) ? multiply(item, scalar) : item * scalar,
  ) as T;
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

export function some<T>(
  arr: Iterable<T>,
  predicate: (v: T) => boolean,
): boolean {
  for (let i of arr) {
    if (predicate(i)) {
      return true;
    }
  }
  return false;
}

/**
 * @example
 * // returns [1, 1], [2, 2], [3, 3], ...
 * for (let i of coordinates([0, 0], [1, 1])) {
 *   console.log(i);
 * }
 */
export function* coordinates(
  [x, y]: [number, number],
  direction: [number, number],
): Generator<[number, number]> {
  let length = 1;
  while (true) {
    const [dx, dy] = multiply(direction, length);
    yield [x + dx, y + dy];
    length += 1;
  }
}
