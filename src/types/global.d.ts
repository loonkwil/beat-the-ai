type FixedArray<T, L> = Array<T> & { length: L };

export {};

declare global {
  type Color = -1 | 1; // -1: white, 1: black

  type CellPosition = FixedArray<number, 2>;
  type CellValue = Color | 0; // 0: empty cell

  type Move = CellPosition;
  type Moves = Array<Move>;

  type Row = FixedArray<CellValue, 15>;
  type Board = FixedArray<Row, 15>;

  type PlayerName = "user" | "robot";
  type PlayerNames = { [color: Color]: PlayerName };
  type Player = (board: Board) => Move;
  type Players = { [color: Color]: Player };
  type Winner = Color | 0; // 0: draw
  type Score = 0 | 0.5 | 1;

  type Game = { moves: Moves; winner: Winner };
  type GameWithScore = Game & { score: Score };

  type Status = "failed" | "succeeded" | "ongoing" | "pending";

  type LevelResult = {
    status: Status;
    score: Score;
    games: Array<GameWithScore>;
  };

  type Results = Array<LevelResult>;
}
