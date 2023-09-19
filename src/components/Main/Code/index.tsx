import { useRef, useEffect, useContext } from "react";
import { EditorView, minimalSetup } from "codemirror";
import {
  keymap,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
} from "@codemirror/view";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import AppContext from "~/context/App";
import styles from "~/components/Main/Code/index.module.css";

export default function Code({ editorId }: { editorId: string }) {
  const [
    {
      code: { value, readOnlyRanges },
    },
    { setCode },
  ] = useContext(AppContext);
  const wrapperRef = useRef<null | Element>(null);
  const editorRef = useRef<null | EditorView>(null);

  useEffect(() => {
    editorRef.current = new EditorView({
      doc: value,
      extensions: [
        minimalSetup,
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion({ icons: false }),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        keymap.of([...closeBracketsKeymap, ...completionKeymap]),
        javascript(),
        EditorView.lineWrapping,
        EditorState.changeFilter.of(({ startState, state }) => {
          const prevValue = startState.doc.toString();
          const nextValue = state.doc.toString();
          return readOnlyRanges.every(
            ([start, end]: [number, number]) =>
              prevValue.slice(start, end) === nextValue.slice(start, end),
          );
        }),
        EditorView.updateListener.of(({ docChanged, state }) => {
          if (docChanged) {
            const nextValue = state.doc.toString();
            setCode(nextValue);
          }
        }),
      ],
      parent: wrapperRef.current,
    });

    editorRef.current.focus();

    return () => editorRef.current?.destroy();
  }, [setCode, readOnlyRanges]);

  return <div id={editorId} className={styles.root} ref={wrapperRef} />;
}
