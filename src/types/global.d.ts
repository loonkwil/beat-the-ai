export {};

declare global {
  type Color = -1 | 1; // -1: white, 1: black

  type CellPosition = [number, number];
  type CellValue = Color | 0; // 0: empty cell

  type Move = CellPosition;
  type Moves = Array<Move>;

  type Row = Array<CellValue>;
  type Board = Array<Row>;

  type PlayerName = "user" | "robot";
  type PlayerNames = { [T in Color]: PlayerName };
  type Player = (board: Board) => Move;
  type Players = { [T in Color]: Player };
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

  type Code = string | null;

  type AppContextType = {
    code: Code;
    setCode: Dispatch<SetStateAction<Code>>;
  };
}
