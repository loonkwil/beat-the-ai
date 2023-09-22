import { useContext } from "react";
import AppContext from "~/context/App";
import Icon from "~/components/Main/Result/Icon";
import { rounds } from "~/settings";
import styles from "~/components/Main/Result/index.module.css";

function Games({ games }) {
  return Array.from({ length: rounds }, (_, gameIndex) => {
    const game = games[gameIndex];
    return <span key={gameIndex} data-result={game?.score} />;
  });
}

function LevelResults({ status, level, score, games }) {
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
        <Games games={games} />
      </div>
    </div>
  );
}

export default function Result({ editorId }: { editorId: string }) {
  const [{ results }] = useContext(AppContext);
  const content =
    results instanceof Error ? (
      <pre>
        <code>{results.message}</code>
      </pre>
    ) : (
      results.map(({ status, score, games }, levelIndex) => (
        <LevelResults
          key={levelIndex}
          status={status}
          level={levelIndex + 1}
          score={score}
          games={games}
        />
      ))
    );

  return (
    <output className={styles.root} htmlFor={editorId}>
      {content}
    </output>
  );
}
