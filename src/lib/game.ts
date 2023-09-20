import { multiply, countWhile, coordinates, some } from "~/lib/math";

export type CellPosition = [number, number];
export type CellValue = number;
export type Row = Array<CellValue> & { length: 19 };
export type Board = Array<Row> & { length: 19 };

export type Move = CellPosition;
export type Player = (board: Board) => Move;
export type Robot = (board: Board) => Move;
export type Game = {
  result: number;
  moves: Array<Move>;
};

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
    [0, 1], // ↑ ↓
    [1, 1], // ↗ ↙
    [1, 0], // → ←
    [1, -1], // ↘ ↖
  ];

  const predicate = ([x, y]: CellPosition): boolean => board?.[x]?.[y] === 1;
  for (let dir of directions) {
    yield countWhile(coordinates(cell, dir), predicate) +
      countWhile(coordinates(cell, multiply(dir, -1)), predicate);
  }
}

export function play(playerA: Player, playerB: Player): Game {
  const moves = [];

  let board = createBoard(19);
  let player = playerA;
  while (true) {
    const [x, y] = player(structuredClone(board));
    board[x][y] = 1;
    moves.push([x, y] as CellPosition);

    if (moves.length === 19 ** 2) {
      return { result: 0, moves };
    }

    if (some(neighbors(board, [x, y]), (n) => n >= 4)) {
      return { result: player === playerA ? 1 : -1, moves };
    }

    board = rotate(board);
    player = player === playerA ? playerB : playerA;
  }
}
