// src/components/portal/SemesterCard.jsx
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import styles from './SemesterCard.module.css'

export default function SemesterCard({ term, gpa, credits, unitCount, isActive, onClick }) {
  return (
    <button
      type="button"
      className={clsx(styles.card, isActive && styles.cardActive)}
      onClick={onClick}
    >
      <div className={styles.left}>
        <p className={styles.term}>{term}</p>
        <p className={styles.meta}>
          {unitCount} units · {credits} credits
        </p>
      </div>
      <div className={styles.right}>
        <span className={styles.gpa}>{gpa.toFixed(2)}</span>
        <span className={styles.gpaLabel}>GPA</span>
      </div>
      <ChevronRight size={16} className={styles.chevron} />
    </button>
  )
}