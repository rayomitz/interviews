import styles from './ProfileSection.module.css'
import clsx from 'clsx'

/**
 * ProfileSection
 *
 * A labelled group of read-only (or future-editable) fields rendered
 * inside the Profile page. Each field is a { label, value } pair.
 *
 * Props:
 *   title      string              — section heading, e.g. "Personal Details"
 *   icon       ReactNode           — optional lucide icon shown beside the title
 *   fields     Array<{
 *                label: string,
 *                value: string | ReactNode,
 *                span?: boolean,   — if true, the field spans both grid columns
 *                highlight?: boolean — if true, value is rendered in green
 *              }>
 *   action     ReactNode           — optional element shown top-right (e.g. an Edit button)
 *   className  string              — optional extra class on the wrapper
 */
export default function ProfileSection({
  title = '',
  icon: Icon,
  fields = [],
  action,
  className,
}) {
  return (
    <div className={clsx(styles.section, className)}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          {Icon && (
            <span className={styles.titleIcon}>
              <Icon size={16} />
            </span>
          )}
          <h3 className={styles.title}>{title}</h3>
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>

      {/* Fields grid */}
      <div className={styles.grid}>
        {fields.map(({ label, value, span, highlight }, i) => (
          <div
            key={i}
            className={clsx(styles.field, span && styles.span)}
          >
            <dt className={styles.label}>{label}</dt>
            <dd
              className={clsx(
                styles.value,
                highlight && styles.highlight,
                !value && styles.empty
              )}
            >
              {value || '—'}
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}