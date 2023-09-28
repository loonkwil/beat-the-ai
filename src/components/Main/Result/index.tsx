import { useContext, useCallback, useEffect, useRef, useMemo } from "react";
import AppContext from "~/context/App";
import Panel from "~/components/Main/Panel";
import Icon from "~/components/Main/Result/Icon";
import { levels, rounds } from "~/settings";
import { useGameScoring } from "~/hooks";
import { range, shuffle } from "~/lib/utils/list";
import styles from "~/components/Main/Result/index.module.css";

type IdMap = Array<number>;

function Games({
  games,
  idMap,
}: {
  games: Array<GameWithScore>;
  idMap: IdMap;
}): React.ReactNode {
  return Array.from({ length: rounds }, (_, gameIndex) => {
    const id = idMap[gameIndex];
    const game = games[id];
    return <span key={gameIndex} data-result={game?.score} />;
  });
}

function LevelResults({
  status,
  level,
  score,
  games,
  idMap,
}: { level: number; idMap: IdMap } & LevelResult): React.ReactNode {
  const percent = Math.round((score / rounds) * 100);
  return (
    <div
      key={level}
      className={`${styles.level} ${
        status === "pending" ? styles.disabled : ""
      }`}
    >
      <div
        className={styles.result}
        title={`You won ${percent}% of the games.`}
        aria-label={`Status: ${status}. Result: you won ${percent}% of the games.`}
      >
        <h3>Level {level + 1}</h3>
        <Icon type={status} />
      </div>
      <div className={styles.details} aria-hidden="true">
        <Games games={games} idMap={idMap} />
      </div>
    </div>
  );
}

export default function Result({
  editorId,
}: {
  editorId: string;
}): React.ReactNode {
  const outputRef = useRef<HTMLOutputElement | null>(null);
  const { code, setCode } = useContext(AppContext);
  const results = useGameScoring({ code });
  const idMap = useMemo(
    () => range(0, levels).map(() => shuffle(range(0, rounds))),
    [code],
  );
  const content =
    results instanceof Error ? (
      <pre>
        <code>{results.message}</code>
      </pre>
    ) : (
      results.map(({ status, score, games }, level) => (
        <LevelResults
          idMap={idMap[level]}
          key={level}
          status={status}
          level={level}
          score={score}
          games={games}
        />
      ))
    );

  const handleClick = useCallback(() => setCode(null), [setCode]);

  const isActive = !!code;
  useEffect(() => {
    if (isActive) {
      outputRef.current?.scrollTo({ top: 0 });
    }
  }, [isActive]);

  return (
    <Panel title="Result" active={isActive}>
      <button onClick={handleClick} aria-label="Go back to edit the code">
        code ◀︎
      </button>
      <output className={styles.root} htmlFor={editorId} ref={outputRef}>
        {content}
      </output>
    </Panel>
  );
}
