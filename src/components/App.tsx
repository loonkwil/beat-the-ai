import { useReducer, useCallback, useEffect } from "react";
import { useGameScoring } from "~/hooks";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import { initialCode, rounds, levels } from "~/settings";
import styles from "~/components/App.module.css";

type State = {
  activePanel: number;
  code: string;
  results: Error | Results;
};

type Action =
  | { type: "SET_ACTIVE_PANEL"; payload: number }
  | { type: "SET_CODE"; payload: string }
  | { type: "RESET_RESULTS" }
  | { type: "ADD_RESULT"; payload: { level: number; game: GameWithScore } }
  | { type: "SHOW_ERROR"; payload: Error };

const initialResults = Array.from({ length: levels }, () => ({
  status: "pending",
  score: 0,
  games: [],
})) as Results;

const initialState: State = {
  activePanel: 0, // 0: code, 1: result
  code: initialCode,
  results: initialResults,
};

function getStatus({
  score,
  currentRound,
}: {
  score: Score;
  currentRound: number;
}): Status {
  if (currentRound < rounds) {
    return "ongoing";
  }

  return score < rounds / 2 ? "failed" : "succeeded";
}

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "SET_ACTIVE_PANEL":
      return { ...state, activePanel: payload };
    case "SET_CODE":
      return { ...state, code: payload };
    case "ADD_RESULT": {
      const { results: prevResults } = state;
      const nextResults =
        prevResults instanceof Error
          ? initialResults
          : structuredClone(prevResults);

      const { level, game } = payload;
      const { score } = game;

      const nextLevelResults = nextResults[level - 1];
      nextLevelResults.score += score;
      nextLevelResults.games.push(game);
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
    (data: { level: number; game: GameWithScore }) =>
      dispatch({ type: "ADD_RESULT", payload: data }),
    [dispatch],
  );

  const resetResults = useCallback(
    () => dispatch({ type: "RESET_RESULTS" }),
    [dispatch],
  );

  const showError = useCallback(
    (error: Error) => dispatch({ type: "SHOW_ERROR", payload: error }),
    [dispatch],
  );

  useGameScoring({
    code,
    compute: activePanel === 1,
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
