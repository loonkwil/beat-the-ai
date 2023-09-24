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

const extensions = [
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
];

export default function useCodeMirror({
  root,
  initialValue = "",
  changeFilter = () => true,
  autoFocus = false,
}: {
  root: React.RefObject<HTMLElement>;
  initialValue?: string;
  changeFilter?: (prev: string, next: string) => boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<null | EditorView>(null);

  useEffect(() => {
    if (!root.current) {
      return;
    }

    ref.current = new EditorView({
      doc: initialValue,
      extensions: [
        ...extensions,
        EditorState.changeFilter.of(({ startState, state }) => {
          const prev = startState.doc.toString();
          const next = state.doc.toString();
          return changeFilter(prev, next);
        }),
      ],
      parent: root.current,
    });

    if (autoFocus) {
      ref.current.focus();
    }

    return () => ref.current?.destroy();
  }, [root, changeFilter, autoFocus]);

  return ref;
}
