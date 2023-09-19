import { useContext } from "react";
import AppContext from "~/context/App";
import Panel from "~/components/Main/Panel";
import Code from "~/components/Main/Code";
import Result from "~/components/Main/Result";
import styles from "~/components/Main/index.module.css";

export default function Main() {
  const [{ activePanel }, { setActivePanel }] = useContext(AppContext);
  const editorId = "code";
  return (
    <main
      className={styles.root}
      style={{ "--active-panel": activePanel } as React.CSSProperties}
    >
      <div className={styles.container}>
        <Panel title="Code">
          <Code editorId={editorId} />
          <button onClick={() => setActivePanel(1)}>run ▶︎</button>
        </Panel>

        <Panel title="Result">
          <button onClick={() => setActivePanel(0)}>code ◀︎</button>
          <Result editorId={editorId} />
        </Panel>
      </div>
    </main>
  );
}
