/**
 * StatCard — KPI metric block
 *
 * Usage:
 *   <StatCard label="Credits Enrolled" value={18} icon={<BookOpen />} />
 *   <StatCard label="Balance Due" value="UGX 450,000" variant="warning" />
 */

import clsx from 'clsx'
import styles from './StatCard.module.css'

export default function StatCard({
  label,
  value,
  sub,           
  icon,          
  variant = 'default',  // 'default' | 'green' | 'warning' | 'error'
  className,
}) {
  return (
    <div className={clsx(styles.card, styles[variant], className)}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value ?? '—'}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}