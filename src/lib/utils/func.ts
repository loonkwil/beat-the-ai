type Range = [number, number];

/**
 * Creates a lightweight abstract syntax tree (AST) from a function declaration.
 * It only works with function declarations, function expressions are not
 * supported.
 * @throws {Error}
 */
export function parse(str: string): {
  0: number;
  1: number;
  id: Range;
  params: Range;
  body: Range;
} {
  const re = /function\s*(\w*)\s*[(]([\w\s,]*)[)]\s*[{](.*)[}]/ds;
  const matches = re.exec(str);
  if (!matches) {
    throw new Error("Function declaration not found");
  }

  const { indices = [] } = matches;
  const [fn, id, params, body] = indices;

  return { ...fn, id, params, body };
}
