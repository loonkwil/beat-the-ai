// Web Worker to generate game results.
//
// Usage:
// const worker = new Worker('/path/to/file');
// worker.addEventListener('message', ({ data }) => /* ... */);
// worker.addEventListener('error', ({ message}) => /* ... */);
// worker.postMessage({ code: '...', rounds: 100, level: 0 });
import { play } from "~/lib/stream/game";
import { shuffle } from "~/lib/utils/list";
import { parse } from "~/lib/utils/func";
import { range } from "~/lib/utils/list";
import { cartesianProduct, euclideanDistance } from "~/lib/utils/math";

const robots = [
  // Level 1
  function move(board) {
    const [x, y] = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * 15),
    );
    return board[x][y] ? move(board) : [x, y];
  },
  // Level 2
  function move(board) {
    const center = [15 / 2, 15 / 2];
    return cartesianProduct(range(0, 15), range(0, 15))
      .filter(([x, y]) => !board[x][y])
      .reduce(
        (min, position) => {
          const distance = euclideanDistance(center, position);
          return distance < min.distance ? { distance, position } : min;
        },
        { distance: Infinity, position: null },
      ).position;
  },
] as Array<Player>;

/** @throws {Error} */
function createUser(code: string): Player {
  const ranges = parse(code);
  const id = code.substring(...ranges.id);
  const params = code.substring(...ranges.params);
  const body = code.substring(...ranges.body);

  // Hide the following objects to prevent cheating
  const protectedObjects = [
    "globalThis",
    "self",
    "postMessage",
    "addEventListener",
  ];

  return Function(
    "board",
    ...protectedObjects,
    `
      return (function ${id}(${params}) {
        "use strict";
        ${body}
      })(board);
    `,
  ) as Player;
}

const onMessage = ({
  data: { code, level = 0, rounds },
}: {
  data: { code: string; level?: number; rounds: number };
}) => {
  const user = createUser(code);
  const robot = robots[level];

  for (let i = 0; i < rounds; i += 1) {
    const [white, black] = shuffle([user, robot]);
    const players = { "-1": white, 1: black };

    const { winner, moves } = play(players);
    const score = winner === 0 ? 0.5 : players[winner] === user ? 1 : 0;
    self.postMessage({ winner, moves, score });
  }

  self.close();
};

self.addEventListener("message", onMessage, { once: true });
