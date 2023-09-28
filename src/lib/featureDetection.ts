export const isCSSNestingSupported = () => CSS.supports("selector(&)");

export const isReadableStreamSupported = () =>
  typeof ReadableStream === "function";
