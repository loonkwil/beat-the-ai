import { useState } from "react";
import AppContext from "~/context/App";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";

export default function App() {
  const [activePanel, setActivePanel] = useState(0);
  const [code, setCode] = useState(null);

  return (
    <AppContext.Provider value={{ activePanel, setActivePanel, code, setCode }}>
      <div className={styles.root}>
        <Header />
        <Main />
      </div>
    </AppContext.Provider>
  );
}
