import { useContext, lazy, Suspense } from "react";
import AppContext from "~/context/App";
import styles from "~/components/Main/index.module.css";

const Code = lazy(() => import("~/components/Main/Code"));
const Result = lazy(() => import("~/components/Main/Result"));
export default function Main() {
  const { code } = useContext(AppContext);
  const activePanelIndex = code ? 1 : 0;
  const editorId = "code";
  return (
    <main
      className={styles.root}
      style={{ "--active-panel": activePanelIndex } as React.CSSProperties}
    >
      <div className={styles.container}>
        <Suspense>
          <Code editorId={editorId} />
          <Result editorId={editorId} />
        </Suspense>
      </div>
    </main>
  );
}
