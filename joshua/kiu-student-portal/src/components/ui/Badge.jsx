import clsx from 'clsx'
import styles from './Badge.module.css'

export default function Badge({
  children,
  variant = 'neutral',  // 'success' | 'warning' | 'error' | 'info' | 'neutral'
  dot = false,          // show a small coloured dot before text
  className,
}) {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}