import { multiply, countWhile, coordinates } from "~/lib/math";

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

export function neighbors(
  board: Board,
  cell: CellPosition,
): Array<number> & { length: 4 } {
  return [
    [0, 1], // ↑ ↓
    [1, 1], // ↗ ↙
    [1, 0], // → ←
    [1, -1], // ↘ ↖
  ].map((direction) => {
    const predicate = ([x, y]: CellPosition): boolean => board?.[x]?.[y] === 1;
    return (
      countWhile(coordinates(cell, direction), predicate) +
      countWhile(coordinates(cell, multiply(direction, -1)), predicate)
    );
  });
}

function won(board: Board): boolean {
  return board.some((col: Array<CellValue>, x: number) =>
    col.some(
      (value: CellValue, y: number) =>
        value === 1 && Math.max(...neighbors(board, [x, y])) >= 4,
    ),
  );
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

    if (won(board)) {
      return { result: player === playerA ? 1 : -1, moves };
    }

    board = rotate(board);
    player = player === playerA ? playerB : playerA;
  }
}
