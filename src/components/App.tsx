import { useState } from "react";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";
import {
  isCSSNestingSupported,
  isReadableStreamSupported,
} from "~/lib/featureDetection";

export default function App() {
  if (!isCSSNestingSupported || !isReadableStreamSupported) {
    throw new Error(
      "Your Browser is not Supported! Try to use a browser that supports nested CSS and ReadableStream (Chrome 112+, Safari 16.5+, Firefox 117+).",
    );
  }

  const [code, setCode] = useState<Code>(null);
  return (
    <AppContext.Provider value={{ code, setCode }}>
      <div className={styles.root}>
        <Header />
        <Main />
      </div>
    </AppContext.Provider>
  );
}
