import { multiply, coordinates } from "~/lib/utils/math";
import { countWhile, some } from "~/lib/utils/list";

type FixedArray<T, L> = Array<T> & { length: L };

export type CellPosition = [number, number];
export type CellValue = number;
export type Row = FixedArray<number, 15>;
export type Board = FixedArray<Row, 15>;

export type Move = CellPosition;
export type Moves = Array<Move>;

export type Player = (board: Board) => Move;
export type PlayerName = "user" | "robot";
export type Color = 0 | 1;
export type Winner = Color | -1;

export type Order = [PlayerName, PlayerName];
export type Score = 0 | 0.5 | 1;
export type Game = { moves: Moves; winner: Winner; order: Order; score: Score };

function createBoard(length = 15): Board {
  return Array.from({ length }, () => Array.from({ length }).fill(0)) as Board;
}

function rotate(board: Board): Board {
  return multiply(board, -1);
}

function stringifyMove([x, y]: Move): string {
  return `${String.fromCharCode("A".charCodeAt() + x)}${y + 1}`;
}

function stringifyMoves(moves: Moves): string {
  return moves
    .reduce(
      (str, move, i) =>
        `${str}${i % 2 ? "" : `${i + 1}. `}${stringifyMove(move)} `,
      "",
    )
    .trim();
}

function stringifyBoard(moves: Moves): string {
  const emptyBoard = [
    "15 . . . . . . . . . . . . . . .",
    "14 . . . . . . . . . . . . . . .",
    "13 . . . . . . . . . . . . . . .",
    "12 . . . . . . . . . . . . . . .",
    "11 . . . . . . . . . . . . . . .",
    "10 . . . . . . . . . . . . . . .",
    " 9 . . . . . . . . . . . . . . .",
    " 8 . . . . . . . . . . . . . . .",
    " 7 . . . . . . . . . . . . . . .",
    " 6 . . . . . . . . . . . . . . .",
    " 5 . . . . . . . . . . . . . . .",
    " 4 . . . . . . . . . . . . . . .",
    " 3 . . . . . . . . . . . . . . .",
    " 2 . . . . . . . . . . . . . . .",
    " 1 . . . . . . . . . . . . . . .",
    "   A B C D E F G H I J K L M N O",
  ].join("\n");
  const white = "O";
  const black = "X";

  return moves.reduce((board, [x, y], i) => {
    const cell = i % 2 ? white : black;
    const start = (14 - y) * (15 * 2 + 2 + 1) + x * 2 + 2;
    //                            (1) (2) (3)      (1) (2)
    // (1) size of a cell, (2) number of the left size, (3) new line
    return `${board.substring(0, start)} ${cell}${board.substring(start + 2)}`;
  }, emptyBoard);
}

function isMoveValid(move: any): boolean {
  return (
    Array.isArray(move) &&
    move.length === 2 &&
    typeof move[0] === "number" &&
    typeof move[1] === "number" &&
    move[0] < 15 &&
    move[0] >= 0 &&
    move[1] < 15 &&
    move[1] >= 0
  );
}

export function* neighbors(
  board: Board,
  cell: CellPosition,
): Generator<number> {
  const directions = [
    /* ↑ ↓ */ [0, 1],
    /* ↗ ↙ */ [1, 1],
    /* → ← */ [1, 0],
    /* ↘ ↖ */ [1, -1],
  ];

  const predicate = ([x, y]: CellPosition): boolean => board?.[x]?.[y] === 1;
  for (const dir of directions) {
    yield countWhile(coordinates(cell, dir), predicate) +
      countWhile(coordinates(cell, multiply(dir, -1)), predicate);
  }
}

export function play(players: [Player, Player]): {
  winner: Winner;
  moves: Moves;
} {
  const moves = [];

  let board = createBoard(15);
  let color: Color = 1; // Black starts the game
  while (true) {
    const player = players[color];

    const move = player(structuredClone(board));
    if (!isMoveValid(move)) {
      const msg = `Your function returned with an invalid move!
${stringifyMoves(moves)}

${stringifyBoard(moves)}

The returned value was: ${JSON.stringify(move)}`;
      throw new Error(msg);
    }

    const [x, y] = move;
    if (board[x][y] !== 0) {
      const msg = `Your function returned with an occupied cell!
${stringifyMoves(moves)}

${stringifyBoard(moves)}

Your move was: ${stringifyMove(move)}`;
      throw new Error(msg);
    }

    board[x][y] = 1;
    moves.push(move);

    if (moves.length === 15 ** 2) {
      return { winner: -1, moves };
    }

    if (some(neighbors(board, move), (n) => n >= 4)) {
      return { winner: color, moves };
    }

    board = rotate(board);
    color = ((color + 1) % 2) as Color;
  }
}
