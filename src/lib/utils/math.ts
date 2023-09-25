type NestedArray<T> = Array<T | NestedArray<T>>;

/**
 * @example
 * multiply(2, 3); // -> 6
 * multiply([0, 1], -1); // -> [0, -1]
 * multiply([[1, 2], [3, 4]], 2); // -> [[2, 4], [6, 8]]
 */
export function multiply<T extends NestedArray<number>>(
  vector: T,
  scalar: number,
): T {
  return vector.map((item) =>
    Array.isArray(item) ? multiply(item, scalar) : item * scalar,
  ) as T;
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

/**
 * @example
 * // returns [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * cartesianProduct([1, 2], ['a', 'b']);
 */
export function cartesianProduct<T, U = T>(
  a: Array<T>,
  b: Array<U>,
): Array<[T, U]> {
  return a.flatMap((fromA) => b.map((fromB) => [fromA, fromB] as [T, U]));
}

/**
 * @example
 * // returns 1.4142135623730951
 * euclideanDistance([1, 1], [2, 2]);
 */
export function euclideanDistance(
  a: [number, number],
  b: [number, number],
): number {
  return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5;
}
