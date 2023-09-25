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
  // React v18 + TypeScript does not support the inert attribute
  // https://github.com/facebook/react/pull/24730
  const inertHack = { inert: active ? null : "" };
  return (
    <section className={styles.root} {...inertHack}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
