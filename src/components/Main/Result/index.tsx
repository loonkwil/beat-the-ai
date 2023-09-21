import { useContext } from "react";
import AppContext from "~/context/App";
import Icon from "~/components/Main/Result/Icon";
import styles from "~/components/Main/Result/index.module.css";

function Games({ rounds, games }) {
  return Array.from({ length: rounds }, (_, gameIndex) => {
    const game = games[gameIndex];
    return <span key={gameIndex} data-result={game?.score} />;
  });
}

function LevelResults({ status, level, score, rounds, games }) {
  return (
    <div
      key={level}
      className={`${styles.level} ${
        status === "pending" ? styles.disabled : ""
      }`}
    >
      <div className={styles.result} title={`${score}/${rounds}`}>
        <h3>Level {level}</h3>
        <Icon type={status} />
      </div>
      <div className={styles.details}>
        <Games rounds={rounds} games={games} />
      </div>
    </div>
  );
}

export default function Result({ editorId }: { editorId: string }) {
  const [{ results }] = useContext(AppContext);
  return (
    <output className={styles.root} htmlFor={editorId}>
      {results.map(({ status, rounds, score, games }, levelIndex) => (
        <LevelResults
          key={levelIndex}
          status={status}
          level={levelIndex + 1}
          score={score}
          rounds={rounds}
          games={games}
        />
      ))}
    </output>
  );
}
