import { shuffle } from "~/lib/utils/list";
import { play } from "~/lib/game";
import { parse } from "~/lib/utils/func";
import type { Player, Winner, Order } from "~/lib/game";

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
  return Function(
    "board",
    `
      return (function ${id}(${params}) {
        "use strict";
        ${body}
      })(board);
    `,
  ) as Player;
}

function getScore({ winner, order }: { winner: Winner; order: Order }): number {
  if (winner === -1) {
    return 0.5;
  }

  return order[winner] === "user" ? 1 : 0;
}

self.addEventListener(
  "message",
  ({
    data: { code, level = 1 },
  }: {
    data: { code: string; level?: number };
  }) => {
    const players = {
      user: createUser(code),
      robot: robots[level - 1],
    };

    while (true) {
      const order = shuffle(["user", "robot"]) as Order;

      const [white, black] = order.map((name) => players[name]);
      const { winner, moves } = play([white, black]);
      const score = getScore({ winner, order });

      self.postMessage({ winner, moves, order, score });
    }
  },
  { once: true },
);
