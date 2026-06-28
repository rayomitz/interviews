import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './QuickActionCard.module.css'
import clsx from 'clsx'

/**
 * QuickActionCard
 *
 * Props:
 *   icon       ReactNode  — lucide icon component
 *   label      string     — e.g. "Hostels"
 *   description string    — one-line helper text
 *   to         string     — react-router path to navigate to
 *   accent     string     — optional: 'green' | 'amber' | 'red' | 'blue' (default 'green')
 *   disabled   boolean
 */
export default function QuickActionCard({
  icon: Icon,
  label = '',
  description = '',
  to = '',
  accent = 'green',
  disabled = false,
}) {
  const navigate = useNavigate()

  function handleClick() {
    if (!disabled && to) navigate(to)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={clsx(
        styles.card,
        styles[`accent-${accent}`],
        disabled && styles.disabled
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
    >
      {/* Icon bubble */}
      <div className={styles.iconWrap}>
        {Icon && <Icon size={22} />}
      </div>

      {/* Text */}
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight size={16} className={styles.arrow} />
    </div>
  )
}