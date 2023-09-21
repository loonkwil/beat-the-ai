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

function get(board: Board, [x, y]: CellPosition): CellValue | undefined {
  return board?.[x]?.[y];
}

function set(board: Board, [x, y]: CellPosition, value: CellValue): Board {
  const col = board[x].toSpliced(y, 1, value);
  return board.toSpliced(x, 1, col);
}

function createBoard(length: number): Board {
  return Array.from({ length }, () => Array.from({ length }).fill(0)) as Board;
}

function rotate(board: Board): Board {
  return multiply(board, -1);
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

  const predicate = (pos: CellPosition): boolean => get(board, pos) === 1;
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
    const move = player(board);
    // TODO detect if the board has not changed

    if (get(board, move) !== 0) {
      throw new Error(`Invalid move: [${move.join(", ")}]`);
    }

    board = set(board, move, 1);
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
