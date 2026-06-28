import { Badge } from '@/components/ui'
import { getInitials, formatDate } from '@/lib/formatters'
import styles from './StudentHero.module.css'

/**
 * StudentHero
 *
 * Props:
 *   name           string  — student full name
 *   registrationNo string  — e.g. "KIU/2021/0456"
 *   programme      string  — e.g. "Bachelor of Computer Science"
 *   admissionStatus string — e.g. "Admitted" | "Continuing"
 *   currentStatus  string  — e.g. "Active" | "Inactive"
 *   admissionDate  string  — ISO date string
 *   greeting       string  — e.g. "Good morning"
 */
export default function StudentHero({
  name = '',
  registrationNo = '',
  programme = '',
  admissionStatus = '',
  currentStatus = '',
  admissionDate = '',
  greeting = 'Hello',
}) {
  const initials = getInitials(name)

  const statusVariant =
    currentStatus?.toLowerCase() === 'active' ? 'success' : 'warning'

  const admissionVariant = 'info'

  const sinceYear = admissionDate
    ? formatDate(admissionDate, { year: 'numeric', month: 'short' })
    : null

  return (
    <div className={styles.hero}>
      {/* Avatar */}
      <div className={styles.avatar}>
        <span>{initials}</span>
      </div>

      {/* Identity */}
      <div className={styles.identity}>
        <p className={styles.greeting}>
          {greeting},{' '}
          <span className={styles.firstName}>{name.split(' ')[0]}</span>
        </p>
        <h1 className={styles.name}>{name}</h1>

        <div className={styles.meta}>
          {registrationNo && (
            <span className={styles.regNo}>{registrationNo}</span>
          )}
          {programme && (
            <span className={styles.programme}>{programme}</span>
          )}
          {sinceYear && (
            <span className={styles.since}>Student since {sinceYear}</span>
          )}
        </div>

        <div className={styles.badges}>
          {currentStatus && (
            <Badge variant={statusVariant} dot>
              {currentStatus}
            </Badge>
          )}
          {admissionStatus && (
            <Badge variant={admissionVariant}>
              {admissionStatus}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}