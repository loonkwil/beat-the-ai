import { shuffle } from "~/lib/utils/list";
import { play } from "~/lib/game";
import { parse } from "~/lib/utils/func";

const robots = [
  // Level 1
  function move(board) {
    const [x, y] = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * 15),
    );
    return board[x][y] ? move(board) : [x, y];
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
  data: { code, level = 1 },
}: {
  data: { code: string; level?: number };
}) => {
  const user = createUser(code);
  const robot = robots[level - 1];

  while (true) {
    const [white, black] = shuffle([user, robot]);
    const players = {
      "-1": white,
      1: black,
    };

    const { winner, moves } = play(players);
    const score = winner === 0 ? 0.5 : players[winner] === user ? 1 : 0;

    self.postMessage({ winner, moves, score });
  }
};

self.addEventListener("message", onMessage, { once: true });
