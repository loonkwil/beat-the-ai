import Icon from "~/components/Main/Result/Icon";
import styles from "~/components/Main/Result/index.module.css";

export default function Result({ editorId }: { editorId: string }) {
  return (
    <output className={styles.root} htmlFor={editorId}>
      {Array.from({ length: 4 }, (_, i) => (
        <div className={`${styles.level} ${i > 2 ? styles.disabled : ""}`}>
          <div className={styles.result}>
            <h3>Level {i + 1}</h3>
            {i === 0 && <Icon type="succeeded" />}
            {i === 1 && <Icon type="pending" />}
            {i === 2 && <Icon type="failed" />}
            {i === 3 && <Icon />}
          </div>
          <div className={styles.details}>
            {Array.from({ length: 100 }, () => (
              <span
                data-result={i > 2 ? null : Math.floor(Math.random() * 3) / 2}
              />
            ))}
          </div>
        </div>
      ))}
    </output>
  );
}
