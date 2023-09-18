import { useRef, useEffect } from "react";
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
import styles from "~/components/Main/Code/index.module.css";

const start = `/**
 * Function that calculates the next move in a given state.
 * @param {Array<number> & { length: 19 }} state - 1: 🤓, 0: ⍽, -1: 🤖
 * @returns {[number, number]} x, y coordinates of your next move
 */
function move(state) {`;

const placeholder = `
  const [x, y] = Array.from(
    { length: 2 },
    () => Math.floor(Math.random() * 19),
  );
  return state[x][y] ? move(state) : [x, y];
`;

const end = `}`;

export default function Code({ editorId }: { editorId: string }) {
  const wrapperRef = useRef<null | Element>(null);
  const editorRef = useRef<null | EditorView>(null);

  useEffect(() => {
    editorRef.current = new EditorView({
      doc: `${start}${placeholder}${end}`,
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
        EditorState.changeFilter.of(({ state: { doc } }) => {
          const str = doc.toString();
          return str.startsWith(start) && str.endsWith(end);
        }),
        EditorView.updateListener.of(({ docChanged, state: { doc } }) => {
          if (docChanged) {
            const str = doc.toString();
            const body = str.slice(start.length).slice(0, -1 * end.length);
            console.log(body);
          }
        }),
      ],
      parent: wrapperRef.current,
    });

    editorRef.current.focus();

    return () => editorRef.current?.destroy();
  }, []);

  return <div id={editorId} className={styles.root} ref={wrapperRef} />;
}
