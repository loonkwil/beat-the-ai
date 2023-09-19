import { useState, useEffect, useRef } from "react";
import sliceFn from "~/lib/sliceFn";
import { play } from "~/lib/game";
import type { Board, Move, Player } from "~/lib/game";

const robots = [
  // Level 1
  function move(board: Board): Move {
    const [x, y] = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * 19),
    );
    return board[x][y] ? move(board) : [x, y];
  },
];

/** @throws {Error} */
function createPlayer(fnBody: string): Player {
  return Function(
    "board",
    `
      return (function move(board) {
        "use strict";
        ${fnBody}
      })(board);
    `,
  ) as Player;
}

const rounds = 100;

export default function useGameScoring({
  code,
  compute = false,
}: {
  code: {
    value: string;
    fnBodyPosition: [number, number];
  };
  compute: boolean;
}) {
  const playerRef = useRef<Player | Error>(new Error("Unknown error"));
  const [progress, setProgress] = useState({
    score: 0,
    games: Array.from({ length: rounds }),
  });

  useEffect(() => {
    if (!compute) {
      return;
    }

    const [, fnBody] = sliceFn(code.value, code.fnBodyPosition);
    try {
      playerRef.current = createPlayer(fnBody);
    } catch (e) {
      console.error(e.message);
      playerRef.current = e;
    }
  }, [code, compute]);

  useEffect(() => {
    if (!compute) {
      return;
    }

    const { current: player } = playerRef;
    if (player instanceof Error) {
      return;
    }

    const tick = setInterval(() => {
      setProgress((progress) => {
        const { score, games } = progress;

        const index = games.findIndex((res) => !res);
        if (index === -1) {
          return { ...progress, done: true };
        }

        const game = play(player, robots[0]);
        return {
          done: false,
          score: score + (game.result + 1) / 2,
          games: games.toSpliced(index, 1, game),
        };
      });
    }, 0);

    return () => clearInterval(tick);
  }, [compute]);

  return progress;
}
