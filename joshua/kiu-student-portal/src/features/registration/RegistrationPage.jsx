// src/features/registration/RegistrationPage.jsx
import { useEffect, useState } from 'react'
import { CalendarClock, GraduationCap, CreditCard, BookOpen } from 'lucide-react'
import { getCurrentRegistration, getRegistrationHistory } from './mockData'
import CourseTable from '@/components/portal/CourseTable'
import { Badge, ErrorState, LoadingState } from '@/components/ui'
import styles from './RegistrationPage.module.css'

const FEES_TONE = { paid: 'success', partial: 'warning', unpaid: 'error' }
const STATUS_TONE = { confirmed: 'success', pending_confirmation: 'warning', draft: 'neutral' }

function formatDeadline(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function RegistrationPage() {
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)  // true from the start — no need to set in effect
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [curRes, histRes] = await Promise.all([
          getCurrentRegistration(),
          getRegistrationHistory(),
        ])
        if (!cancelled) {
          setCurrent(curRes.data.data)
          setHistory(histRes.data.data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('We could not load your registration details. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [retryKey])

  function handleRetry() {
    setLoading(true)  // safe — called from an event handler, not an effect
    setError(null)
    setRetryKey((k) => k + 1)
  }

  if (loading) {
    return <LoadingState message="Loading your registration…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />
  }

  const remainingDays = daysUntil(current.deadline)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Registration</h1>
          <p className={styles.subtitle}>{current.term}</p>
        </div>
        <Badge tone={STATUS_TONE[current.status] ?? 'neutral'}>
          {current.status.replace('_', ' ')}
        </Badge>
      </div>

      {remainingDays <= 14 && current.status !== 'confirmed' && (
        <div className={styles.deadlineNotice}>
          <CalendarClock size={18} />
          <span>
            Registration deadline is <strong>{formatDeadline(current.deadline)}</strong> —{' '}
            {remainingDays} day(s) remaining.
          </span>
        </div>
      )}

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <BookOpen size={18} />
          </div>
          <div>
            <p className={styles.kpiValue}>{current.total_credits}</p>
            <p className={styles.kpiLabel}>Credits ({current.max_credits} max)</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <GraduationCap size={18} />
          </div>
          <div>
            <p className={styles.kpiValue}>{current.course_count}</p>
            <p className={styles.kpiLabel}>Courses registered</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <CalendarClock size={18} />
          </div>
          <div>
            <p className={styles.kpiValue}>{current.gpa_projection.toFixed(2)}</p>
            <p className={styles.kpiLabel}>Projected GPA</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>
            <CreditCard size={18} />
          </div>
          <div>
            <p className={styles.kpiValue}>
              <Badge tone={FEES_TONE[current.fees_status] ?? 'neutral'}>
                {current.fees_status}
              </Badge>
            </p>
            <p className={styles.kpiLabel}>Fees status</p>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Registered courses</h2>
        <CourseTable courses={current.courses} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Registration history</h2>
        <div className={styles.historyGrid}>
          {history.map((entry) => (
            <div key={entry.term} className={styles.historyCard}>
              <div className={styles.historyHeader}>
                <p className={styles.historyTerm}>{entry.term}</p>
                <Badge tone="neutral">{entry.status}</Badge>
              </div>
              <div className={styles.historyStats}>
                <span>{entry.course_count} courses</span>
                <span>{entry.total_credits} credits</span>
                <span>GPA {entry.gpa.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
