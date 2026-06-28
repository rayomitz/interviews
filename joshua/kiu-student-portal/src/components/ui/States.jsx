/**
 * Feedback state components:
 *   <LoadingState />
 *   <LoadingState message="Fetching your results..." />
 *
 *   <ErrorState message="Could not load dashboard." onRetry={refetch} />
 *
 *   <EmptyState
 *     title="No courses registered"
 *     message="You haven't registered any courses for this semester."
 *     icon={<BookOpen />}
 *   />
 */

import { Loader2, AlertCircle, Inbox } from 'lucide-react'
import Button from './Button'
import styles from './States.module.css'

/*Loading*/
export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className={styles.center}>
      <Loader2 size={32} className={styles.spinner} />
      <p className={styles.msg}>{message}</p>
    </div>
  )
}

/*Error*/
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className={styles.center}>
      <AlertCircle size={32} className={styles.errorIcon} />
      <p className={styles.msg}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

/*Empty*/
export function EmptyState({ title = 'Nothing here yet', message, icon, action }) {
  return (
    <div className={styles.center}>
      <span className={styles.emptyIcon}>
        {icon ?? <Inbox size={36} />}
      </span>
      <p className={styles.emptyTitle}>{title}</p>
      {message && <p className={styles.msg}>{message}</p>}
      {action}
    </div>
  )
}