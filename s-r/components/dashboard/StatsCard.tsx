import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: number | string;
  color: string;
}

export default function StatsCard({ title, value, color }: StatsCardProps) {
  return (
    <div className={styles.card} style={{ borderLeftColor: color }}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
