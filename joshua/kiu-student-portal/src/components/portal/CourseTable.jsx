// src/components/portal/CourseTable.jsx
import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import styles from './CourseTable.module.css'

const COLUMNS = [
  { key: 'course_code', label: 'Code' },
  { key: 'course_name', label: 'Course' },
  { key: 'credits', label: 'Credits' },
  { key: 'lecturer', label: 'Lecturer' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'status', label: 'Status' },
]

export default function CourseTable({ courses = [] }) {
  const [sortKey, setSortKey] = useState('course_code')
  const [sortDir, setSortDir] = useState('asc')

  const sorted = useMemo(() => {
    const list = [...courses]
    list.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return list
  }, [courses, sortKey, sortDir])

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (courses.length === 0) {
    return <p className={styles.emptyNote}>No courses registered for this semester yet.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <ArrowUpDown size={12} className={styles.sortIcon} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((course) => (
            <tr key={course.course_id}>
              <td className={styles.codeCell}>{course.course_code}</td>
              <td>{course.course_name}</td>
              <td>{course.credits}</td>
              <td>{course.lecturer}</td>
              <td className={styles.scheduleCell}>{course.schedule}</td>
              <td>
                <Badge tone={course.status === 'registered' ? 'success' : 'neutral'}>
                  {course.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}