import { useRef, useContext, useCallback } from "react";
import AppContext from "~/context/App";
import { useCodeMirror } from "~/hooks";
import { slice } from "~/lib/utils/func";
import styles from "~/components/Main/Code/index.module.css";

export default function Code({ editorId }: { editorId: string }) {
  const [{ code }, { setCode }] = useContext(AppContext);
  const changeFilter = useCallback(
    (prev: string, next: string): boolean => {
      const [a, b] = [prev, next].map((str) => slice(str, code.fnBodyPosition));
      return a[0] === b[0] && a[2] === b[2];
    },
    [code.fnBodyPosition],
  );

  const ref = useRef<HTMLDivElement>(null);
  useCodeMirror({
    root: ref,
    initialValue: code.value,
    changeFilter,
    autoFocus: true,
    onChange: setCode,
  });

  return <div id={editorId} className={styles.root} ref={ref} />;
}
