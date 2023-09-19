import { useContext } from "react";
import AppContext from "~/context/App";
import { useGameScoring } from "~/hooks";
import Icon from "~/components/Main/Result/Icon";
import styles from "~/components/Main/Result/index.module.css";

export default function Result({ editorId }: { editorId: string }) {
  const [{ code, activePanel }] = useContext(AppContext);
  const progress = useGameScoring({ code, compute: activePanel === 1 });

  const iconType = (() => {
    if (!progress.done) {
      return "pending";
    }

    if (progress.score > 50) {
      return "succeeded";
    }

    return "failed";
  })();
  return (
    <output className={styles.root} htmlFor={editorId}>
      <div className={styles.level}>
        <div className={styles.result} title={`${progress.score}/100`}>
          <h3>Level 1</h3>
          <Icon type={iconType} />
        </div>
        <div className={styles.details}>
          {progress.games.map((game, index) => (
            <span key={index} data-result={game?.result} />
          ))}
        </div>
      </div>
      <div className={`${styles.level} ${styles.disabled}`}>
        <div className={styles.result}>
          <h3>Level 2</h3>
          <Icon />
        </div>
        <div className={styles.details}>
          {Array.from({ length: 100 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </output>
  );
}
