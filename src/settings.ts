export const rounds = 120;

export const levels = 3;

export const initialCode = `/**
 * Function that calculates the next move in a given state.
 * @param {Array<Array<number>>} board - 🤖: -1, ⍽: 0, 🤓: 1
 * @returns {[number, number]} x, y coordinates of your next move
 */
function move(board) {
  const [x, y] = Array.from(
    { length: 2 },
    () => Math.floor(Math.random() * 15),
  );
  return board[x][y] ? move(board) : [x, y];
}`;
