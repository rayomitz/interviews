import { Construction } from 'lucide-react'
import styles from './ComingSoon.module.css'

/**
 * ComingSoon
 *
 * Shown inside Profile tabs that have no live API endpoint yet.
 *
 * Props:
 *   title       string  — e.g. "Documents"
 *   description string  — optional helper text
 */
export default function ComingSoon({
  title = 'Coming soon',
  description = 'This section will be available once the backend endpoint is ready.',
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>
        <Construction size={32} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
    </div>
  )
}