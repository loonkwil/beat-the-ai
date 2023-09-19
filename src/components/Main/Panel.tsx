import styles from "~/components/Main/Panel.module.css";

export default function Panel({
  title,
  active = false,
  children,
}: {
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.root} inert={active ? null : ""}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
