import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, QrCode } from 'lucide-react'
import { Button, ErrorState, LoadingState } from '@/components/ui'
import { getAttendance } from './api'
import AttendanceCourseCard from './AttendanceCourseCard'
import styles from './AttendancePage.module.css'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  function handleRetry() {
    setLoading(true)
    setError('')
    setRetryKey((key) => key + 1)
  }

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const res = await getAttendance()
        const payload = res.data.data
        if (!cancelled) {
          setStudent(payload.student ?? null)
          setAttendance(payload.attendance ?? [])
          setError('')
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ??
          'Could not load your attendance summary. Please try again.'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [retryKey])

  if (loading) {
    return <LoadingState message="Loading your attendance..." />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRetry}
        retryLabel="Try again"
      />
    )
  }

  const totalCourses = attendance.length
  const defaulters = attendance.filter((course) => course.is_defaulter).length

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.iconBubble}>
          <CalendarCheck size={24} />
        </div>
        <div>
          <p className={styles.kicker}>Attendance</p>
          <h1>My attendance summary</h1>
          <p>
            {student?.name ?? 'Student'} · {student?.registration_no ?? 'Current term'}
          </p>
        </div>
        <Button as={Link} to="/app/attendance/check-in" icon={QrCode}>
          Check in
        </Button>
      </section>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span>Courses tracked</span>
          <strong>{totalCourses}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Below threshold</span>
          <strong>{defaulters}</strong>
        </div>
      </section>

      {attendance.length === 0 ? (
        <div className={styles.empty}>
          No attendance records are available for this term yet.
        </div>
      ) : (
        <section className={styles.courseGrid}>
          {attendance.map((course) => (
            <AttendanceCourseCard
              key={`${course.course_id}-${course.term_definition_id}`}
              courseCode={course.course_code}
              courseName={course.course_name}
              attended={course.attended}
              delivered={course.delivered}
              attendancePct={course.attendance_pct}
              thresholdPct={course.threshold_pct}
              isDefaulter={course.is_defaulter}
            />
          ))}
        </section>
      )}
    </div>
  )
}
