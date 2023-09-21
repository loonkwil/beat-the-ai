type Path = Array<string | number>;

export function get(obj: Object, path: Path): any {
  if (path.length === 0) {
    return obj;
  }

  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }

  const [x, ...xs] = path;
  return get(obj[x], xs);
}

export function set(obj, path, value) {
  if (path.length === 0) {
    return value;
  }

  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }

  const [x, ...xs] = path;
  return (obj[x] = set(obj[x], xs, value));
}
