import { useRef, useContext, useCallback } from "react";
import AppContext from "~/context/App";
import { useCodeMirror } from "~/hooks";
import { parse } from "~/lib/utils/func";
import { initialCode } from "~/settings";
import styles from "~/components/Main/Code/index.module.css";

const ranges = parse(initialCode);
const readonlyParts = {
  start: initialCode.substring(0, ranges.body[0]),
  end: initialCode.substring(ranges.body[1]),
};

export default function Code({ editorId }: { editorId: string }) {
  const [{ code }, { setCode }] = useContext(AppContext);
  const changeFilter = useCallback(
    (_: string, next: string): boolean =>
      next.startsWith(readonlyParts.start) && next.endsWith(readonlyParts.end),
    [],
  );

  const ref = useRef<HTMLDivElement>(null);
  useCodeMirror({
    root: ref,
    initialValue: code,
    changeFilter,
    autoFocus: true,
    onChange: setCode,
  });

  return <div id={editorId} className={styles.root} ref={ref} />;
}
