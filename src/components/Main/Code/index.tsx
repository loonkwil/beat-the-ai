import { useRef, useContext, useCallback } from "react";
import AppContext from "~/context/App";
import Panel from "~/components/Main/Panel";
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
  const { code, setCode } = useContext(AppContext);

  const changeFilter = useCallback(
    (_: string, next: string): boolean =>
      next.startsWith(readonlyParts.start) && next.endsWith(readonlyParts.end),
    [],
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useCodeMirror({
    root: wrapperRef,
    initialValue: initialCode,
    changeFilter,
    autoFocus: true,
  });

  const handleClick = useCallback(() => {
    const code = editorRef.current?.state?.doc?.toString() ?? null;
    setCode(code);
  }, [setCode, editorRef]);

  const isActive = !code;
  return (
    <Panel title="Code" active={isActive}>
      <div id={editorId} className={styles.root} ref={wrapperRef} />
      <button onClick={handleClick}>run ▶︎</button>
    </Panel>
  );
}
