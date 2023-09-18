import styles from "~/components/Main/Panel.module.css";

export default function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.root}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
