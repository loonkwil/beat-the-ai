import { useReducer, useCallback, useEffect } from "react";
import { useGameScoring } from "~/hooks";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";
import type { Game } from "~/lib/game";

type Status = "failed" | "succeeded" | "ongoing" | "pending";

type LevelResult = {
  status: Status;
  rounds: number;
  score: number;
  games: Array<Game>;
};

type Results = Array<LevelResult>;

type State = {
  activePanel: number;
  code: {
    value: string;
    fnBodyPosition: [number, number];
  };
  results: Error | Results;
};

type Action =
  | { type: "SET_ACTIVE_PANEL"; payload: number }
  | { type: "SET_CODE"; payload: string }
  | { type: "RESET_RESULTS" }
  | { type: "ADD_RESULT"; payload: { level: number; game: Game } }
  | { type: "SHOW_ERROR"; payload: Error };

const config = {
  levels: 4,
  rounds: 100,
} as const;

const initialResults = Array.from({ length: config.levels }, () => ({
  status: "pending",
  rounds: config.rounds,
  score: 0,
  games: [],
})) as Results;

const initialState: State = {
  activePanel: 0, // 0: code, 1: result
  code: {
    value: `/**
 * Function that calculates the next move in a given state.
 * @param {Array<Array<number>>} board - 🤖: -1, ⍽: 0, 🤓: 1
 * @returns {[number, number]} x, y coordinates of your next move
 */
function move(board) {
  const [x, y] = Array.from(
    { length: 2 },
    () => Math.floor(Math.random() * 19),
  );
  return board[x][y] ? move(board) : [x, y];
}`,
    fnBodyPosition: [217, -1],
  },
  results: initialResults,
};

function getStatus({
  score,
  currentRound,
}: {
  score: number;
  currentRound: number;
}): Status {
  if (currentRound < config.rounds) {
    return "ongoing";
  }

  return score < config.rounds / 2 ? "failed" : "succeeded";
}

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "SET_ACTIVE_PANEL":
      return { ...state, activePanel: payload };
    case "SET_CODE":
      return { ...state, code: { ...state.code, value: payload } };
    case "ADD_RESULT": {
      const { results: prevResults } = state;
      const nextResults =
        prevResults instanceof Error
          ? initialResults
          : structuredClone(prevResults);

      const { level, game } = payload;
      const { score } = game;

      const nextLevelResults = nextResults[level - 1];
      nextLevelResults.rounds = config.rounds;
      nextLevelResults.score += score;
      nextLevelResults.games.push({ ...game, score });
      nextLevelResults.status = getStatus({
        score: nextLevelResults.score,
        currentRound: nextLevelResults.games.length,
      });

      return { ...state, results: nextResults };
    }
    case "RESET_RESULTS":
      return { ...state, results: initialResults };
    case "SHOW_ERROR":
      return { ...state, results: payload };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { code, activePanel } = state;

  const setActivePanel = useCallback(
    (activePanel: number) =>
      dispatch({ type: "SET_ACTIVE_PANEL", payload: activePanel }),
    [dispatch],
  );

  const setCode = useCallback(
    (code: string) => dispatch({ type: "SET_CODE", payload: code }),
    [dispatch],
  );

  const addResult = useCallback(
    ({ level, game }: { level: number; game: Game }) =>
      dispatch({ type: "ADD_RESULT", payload: { level, game } }),
    [dispatch],
  );

  const resetResults = useCallback(
    () => dispatch({ type: "RESET_RESULTS" }),
    [dispatch],
  );

  const showError = useCallback(
    (e: Error) => dispatch({ type: "SHOW_ERROR", payload: e }),
    [dispatch],
  );

  useGameScoring({
    code,
    compute: activePanel === 1,
    rounds: config.rounds,
    levels: config.levels,
    onResult: addResult,
    onError: showError,
  });

  useEffect(() => {
    if (activePanel === 0) {
      resetResults();
    }
  }, [activePanel]);

  return (
    <AppContext.Provider value={[state, { setActivePanel, setCode }]}>
      <div className={styles.root}>
        <Header />
        <Main />
      </div>
    </AppContext.Provider>
  );
}
