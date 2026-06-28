// src/features/results/ResultsPage.jsx
import { useEffect, useState } from 'react'
import { Download, GraduationCap, Award } from 'lucide-react'
import { getResults, downloadTranscript } from './mockData'
import SemesterCard from '@/components/portal/SemesterCard'
import { Badge, Button, ErrorState, LoadingState } from '@/components/ui'
import styles from './ResultsPage.module.css'

const GRADE_TONE = {
  A: 'success',
  'A-': 'success',
  'B+': 'success',
  B: 'warning',
  'B-': 'warning',
  C: 'error',
}

function gradeTone(grade) {
  return GRADE_TONE[grade] ?? 'neutral'
}

export default function ResultsPage() {
  const [results, setResults] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)   // true from the start — no need to set in effect
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadNote, setDownloadNote] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await getResults()
        if (!cancelled) {
          setResults(res.data.data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('We could not load your results. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [retryKey])

  async function handleDownload() {
    setDownloading(true)
    setDownloadNote(null)
    try {
      const res = await downloadTranscript()
      setDownloadNote(res.data.data.message)
    } catch {
      setDownloadNote('Transcript download failed. Please try again later.')
    } finally {
      setDownloading(false)
    }
  }

  function handleRetry() {
    setLoading(true)   // safe here — called from an event handler, not an effect
    setError(null)
    setRetryKey((k) => k + 1)
  }

  if (loading) {
    return <LoadingState message="Loading your results…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />
  }

  const activeSemester = results.semesters[activeIndex]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroLabel}>
            <GraduationCap size={16} /> Cumulative GPA
          </span>
          <p className={styles.heroGpa}>{results.cumulative_gpa.toFixed(2)}</p>
          <p className={styles.heroCredits}>{results.total_credits_earned} credits earned</p>
        </div>
        <Button onClick={handleDownload} loading={downloading} icon={Download}>
          Download transcript
        </Button>
      </div>

      {downloadNote && <div className={styles.downloadNote}>{downloadNote}</div>}

      <div className={styles.layout}>
        <aside className={styles.tabs}>
          {results.semesters.map((sem, i) => (
            <SemesterCard
              key={sem.term}
              term={sem.term}
              gpa={sem.gpa}
              credits={sem.credits}
              unitCount={sem.units.length}
              isActive={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </aside>

        <section className={styles.gradesSection}>
          <div className={styles.gradesHeader}>
            <h2 className={styles.gradesTitle}>{activeSemester.term}</h2>
            <span className={styles.gradesMeta}>
              <Award size={14} /> Semester GPA {activeSemester.gpa.toFixed(2)}
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Grade points</th>
                </tr>
              </thead>
              <tbody>
                {activeSemester.units.map((unit) => (
                  <tr key={unit.course_code}>
                    <td className={styles.codeCell}>{unit.course_code}</td>
                    <td>{unit.course_name}</td>
                    <td>{unit.credits}</td>
                    <td>
                      <Badge tone={gradeTone(unit.grade)}>{unit.grade}</Badge>
                    </td>
                    <td>{unit.grade_point.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
