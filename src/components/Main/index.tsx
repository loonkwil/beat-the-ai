import { useContext } from "react";
import AppContext from "~/context/App";
import Code from "~/components/Main/Code";
import Result from "~/components/Main/Result";
import styles from "~/components/Main/index.module.css";

export default function Main() {
  const { activePanel } = useContext(AppContext);
  const editorId = "code";
  return (
    <main
      className={styles.root}
      style={{ "--active-panel": activePanel } as React.CSSProperties}
    >
      <div className={styles.container}>
        <Code editorId={editorId} />
        <Result editorId={editorId} />
      </div>
    </main>
  );
}
