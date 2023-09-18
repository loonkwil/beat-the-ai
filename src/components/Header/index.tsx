import styles from "~/components/Header/index.module.css";

export default function Header() {
  return (
    <header className={styles.root}>
      <hgroup>
        <h1>Beat the AI</h1>
        <p>
          Try to write a JavaScript function that beats the AI in a game called{" "}
          <dfn title="Five in a Row, also known as Gomoku or Gobang, is a classic two-player strategy board game that is played on a grid. The objective of the game is to be the first player to form a continuous horizontal, vertical, or diagonal line of five of their own pieces on the board.">
            Five in a Row
          </dfn>
          .
        </p>
      </hgroup>
    </header>
  );
}
