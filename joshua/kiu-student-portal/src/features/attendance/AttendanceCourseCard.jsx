import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui'
import styles from './AttendanceCourseCard.module.css'
import clsx from 'clsx'

/**
 * AttendanceCourseCard
 *
 * Displays one course's attendance record with:
 *   - Course code + name header
 *   - Attended / Delivered session count
 *   - Neumorphic inset progress bar with a threshold marker line
 *   - "Defaulter" badge + warning colouring when is_defaulter === true
 *
 * Props:
 *   courseCode    string   — e.g. "CIT 2103"
 *   courseName    string   — e.g. "Database Systems"
 *   attended      number   — sessions the student attended
 *   delivered     number   — sessions delivered so far this term
 *   attendancePct number   — 0–100 (percentage attended)
 *   thresholdPct  number   — minimum required percentage (e.g. 75)
 *   isDefaulter   boolean  — true → red warning treatment
 */
export default function AttendanceCourseCard({
  courseCode = '',
  courseName = '',
  attended = 0,
  delivered = 0,
  attendancePct = 0,
  thresholdPct = 75,
  isDefaulter = false,
}) {
  const pct = Math.min(Math.max(attendancePct, 0), 100)
  const threshold = Math.min(Math.max(thresholdPct, 0), 100)

  // Colour the bar: green above threshold, amber close (< threshold but ≥ threshold-10), red below
  const barVariant =
    isDefaulter || pct < threshold
      ? pct < threshold - 10
        ? 'danger'
        : 'warning'
      : 'safe'

  return (
    <div
      className={clsx(
        styles.card,
        isDefaulter && styles.cardDefaulter
      )}
    >
      {/*Header*/}
      <div className={styles.header}>
        <div className={styles.courseInfo}>
          <span className={styles.courseCode}>{courseCode}</span>
          <span className={styles.courseName}>{courseName}</span>
        </div>

        <div className={styles.badges}>
          {isDefaulter && (
            <Badge variant="error" dot>
              Defaulter
            </Badge>
          )}
          {!isDefaulter && pct >= threshold && (
            <Badge variant="success">On track</Badge>
          )}
          {!isDefaulter && pct < threshold && (
            <Badge variant="warning">At risk</Badge>
          )}
        </div>
      </div>

      {/*Session count*/}
      <div className={styles.countRow}>
        <span className={styles.countLabel}>Sessions attended</span>
        <span className={styles.countValue}>
          <strong>{attended}</strong>
          <span className={styles.countSep}>/</span>
          {delivered}
        </span>
      </div>

      {/*Progress bar */}
      <div className={styles.progressWrap}>
        {/* Inset track */}
        <div className={styles.track}>
          {/* Fill */}
          <div
            className={clsx(styles.fill, styles[`fill-${barVariant}`])}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct}% attendance`}
          />
          {/* Threshold marker */}
          <div
            className={styles.thresholdMarker}
            style={{ left: `${threshold}%` }}
            title={`Required: ${threshold}%`}
          />
        </div>

        {/* Percentage labels */}
        <div className={styles.progressLabels}>
          <span
            className={clsx(
              styles.pctValue,
              isDefaulter && styles.pctDanger,
              !isDefaulter && pct < threshold && styles.pctWarning
            )}
          >
            {Math.round(pct)}%
          </span>
          <span className={styles.thresholdLabel}>Min: {threshold}%</span>
        </div>
      </div>

      {/*Defaulter alert strip */}
      {isDefaulter && (
        <div className={styles.defaulterAlert}>
          <AlertTriangle size={14} />
          <span>
            Your attendance is below the required {threshold}% threshold. Contact your
            lecturer or academic office immediately.
          </span>
        </div>
      )}
    </div>
  )
}