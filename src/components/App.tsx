import { useState } from "react";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";

export default function App() {
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
