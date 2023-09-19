import { useReducer, useCallback } from "react";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";

type State = {
  activePanel: number;
  code: {
    value: string;
    fnBodyPosition: [number, number];
  };
};

type Action =
  | { type: "SET_ACTIVE_PANEL"; payload: number }
  | { type: "SET_CODE"; payload: string };

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
};

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case "SET_ACTIVE_PANEL":
      return { ...state, activePanel: payload };
    case "SET_CODE":
      return { ...state, code: { ...state.code, value: payload } };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setActivePanel = useCallback(
    (activePanel: number) =>
      dispatch({ type: "SET_ACTIVE_PANEL", payload: activePanel }),
    [dispatch],
  );
  const setCode = useCallback(
    (code: string) => dispatch({ type: "SET_CODE", payload: code }),
    [dispatch],
  );

  return (
    <AppContext.Provider value={[state, { setActivePanel, setCode }]}>
      <div className={styles.root}>
        <Header />
        <Main />
      </div>
    </AppContext.Provider>
  );
}
