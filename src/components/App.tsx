import { useState } from "react";
import Header from "~/components/Header";
import Main from "~/components/Main";
import styles from "~/components/App.module.css";

export default function App() {
  const [activePanel, setActivePanel] = useState();

  return (
    <div className={styles.root}>
      <Header />
      <Main activePanel={activePanel} setActivePanel={setActivePanel} />
    </div>
  );
}
