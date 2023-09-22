import { multiply, coordinates } from "~/lib/utils/math";
import { countWhile, some } from "~/lib/utils/list";

function stringifyMove([x, y]: Move): string {
  return String.fromCharCode("A".charCodeAt(0) + x) + `${y + 1}`;
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

function createBoard(length = 15): Board {
  return Array.from({ length }, () => Array.from({ length }).fill(0)) as Board;
}

function rotate(board: Board): Board {
  return multiply(board, -1);
}

function isMoveValid(move: any): boolean {
  if (!Array.isArray(move) || move.length !== 2) {
    return false;
  }

  return move.every((v) => typeof v === "number" && v < 15 && v >= 0);
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

function createInvalidMoveError({
  moves,
  move,
}: {
  moves: Moves;
  move: Move;
}): Error {
  const msg = [
    "Your function returned with an invalid move!",
    stringifyMoves(moves),
    "",
    stringifyBoard(moves),
    "",
    `The returned value was: ${JSON.stringify(move)}.`,
  ].join("\n");
  return new Error(msg);
}

function createOccupiedCellError({
  moves,
  move,
}: {
  moves: Moves;
  move: Move;
}): Error {
  const msg = [
    "Your function returned with an occupied cell!",
    stringifyMoves(moves),
    "",
    stringifyBoard(moves),
    "",
    `Your move was: ${stringifyMove(move)}`,
  ].join("\n");
  return new Error(msg);
}

export function play(players: Players): Game {
  const moves = [];

  let board = createBoard(15);
  let color = 1 as Color; // Black starts the game
  while (true) {
    const player = players[color];

    // Create a deep copy of a board to prevent cheating
    const boardCopy = structuredClone(board);
    const move = player(boardCopy);

    if (!isMoveValid(move)) {
      throw createInvalidMoveError({ moves, move });
    }

    const [x, y] = move;
    if (board[x][y] !== 0) {
      throw createOccupiedCellError({ moves, move });
    }

    board[x][y] = 1;
    moves.push(move);

    if (moves.length === 15 ** 2) {
      return { winner: 0, moves };
    }

    if (some(neighbors(board, move), (n) => n >= 4)) {
      return { winner: color, moves };
    }

    board = rotate(board);
    color *= -1;
  }
}
