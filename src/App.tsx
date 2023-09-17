import { useState } from "react";

function Icon({
  type = "empty",
}: {
  type?: "succeeded" | "failed" | "pending" | "empty";
}) {
  const icon = {
    succeeded: <path d="M10.833 16L14.6063 19.7733L22.1663 12.2267" />,
    failed: (
      <path d="M12.7266 19.7734L20.2732 12.2267M20.2732 19.7734L12.7266 12.2267" />
    ),
    pending: (
      <>
        <path d="M21.8283 16H21.8403" />
        <path d="M16.4943 16H16.5063" />
        <path d="M11.1593 16H11.1713" />
      </>
    ),
    empty: null,
  }[type];

  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: `var(--black` }}
      >
        <path
          d="M16.5003 29.3333C23.8337 29.3333 29.8337 23.3333 29.8337 16C29.8337 8.66667 23.8337 2.66667 16.5003 2.66667C9.16699 2.66667 3.16699 8.66667 3.16699 16C3.16699 23.3333 9.16699 29.3333 16.5003 29.3333Z"
          style={{ fill: `var(--icon-${type})` }}
        />
        {icon}
      </g>
    </svg>
  );
}

function Header() {
  return (
    <header>
      <hgroup>
        <h1>Beat the AI</h1>
        <p>
          Try to write a JavaScript function that beats the AI in a game called{" "}
          <dfn title="Five in a Row, also known as Gomoku or Gobang, is a classic two-player strategy board game that is played on a grid. The objective of the game is to be the first player to form a continuous horizontal, vertical, or diagonal line of five of their own pieces on the board.">
            Five in a Row
          </dfn>
          .
        </p>
      </hgroup>
    </header>
  );
}

function Code({ textareaId }: { textareaId: string }) {
  const defaultValue = `/**
 * Function that calculates the next move in a given state.
 * @param {Array<number> & { length: 19 }} state - 0: empty, 1: you, -1: enemy
 * @returns {[number, number]} x, y coordinates of your next move
 */
function move(state) {
  const [x, y] = Array.from(
    { length: 2 },
    () => Math.floor(Math.random() * 19),
  );
  return state[x][y] ? move(state) : [x, y];
}`;

  return (
    <textarea id={textareaId} spellCheck="false" defaultValue={defaultValue} />
  );
}

function CodePanel({
  closeRequest,
  textareaId,
}: {
  closeRequest: () => void;
  textareaId: string;
}) {
  return (
    <section>
      <h2>Code</h2>
      <Code textareaId={textareaId} />
      <button onClick={() => closeRequest()}>run ▶︎</button>
    </section>
  );
}

function Output({ textareaId }: { textareaId: string }) {
  return (
    <output htmlFor={textareaId}>
      {Array.from({ length: 4 }, (_, i) => (
        <div className={`level ${i > 2 ? "disabled" : ""}`}>
          <div className="result">
            <h3>Level {i + 1}</h3>
            {i === 0 && <Icon type="succeeded" />}
            {i === 1 && <Icon type="pending" />}
            {i === 2 && <Icon type="failed" />}
            {i === 3 && <Icon />}
          </div>
          <div className="details">
            {Array.from({ length: 100 }, () => (
              <span data-result={i > 2 ? null : Math.round(Math.random())} />
            ))}
          </div>
        </div>
      ))}
    </output>
  );
}

function ResultPanel({
  closeRequest,
  textareaId,
}: {
  closeRequest: () => void;
  textareaId: string;
}) {
  return (
    <section>
      <h2>Result</h2>
      <button onClick={() => closeRequest()}>code ◀︎</button>
      <Output textareaId={textareaId} />
    </section>
  );
}

function Main({
  activePanel = 0,
  setActivePanel,
}: {
  activePanel?: number;
  setActivePanel: (idx: number) => void;
}) {
  const textareaId = "code";
  return (
    <main style={{ "--active-panel": activePanel } as React.CSSProperties}>
      <div className="container">
        <CodePanel
          closeRequest={() => setActivePanel(1)}
          textareaId={textareaId}
        />
        <ResultPanel
          closeRequest={() => setActivePanel(0)}
          textareaId={textareaId}
        />
      </div>
    </main>
  );
}

function App() {
  const [activePanel, setActivePanel] = useState();

  return (
    <>
      <Header />
      <Main activePanel={activePanel} setActivePanel={setActivePanel} />
    </>
  );
}

export default App;
