/**
 * DataTable generic table component
 *
 * Usage:
 *   const columns = [
 *     { key: 'course_code', header: 'Code' },
 *     { key: 'course_name', header: 'Course' },
 *     { key: 'grade', header: 'Grade', render: (row) => <Badge>{row.grade}</Badge> },
 *   ]
 *   <DataTable columns={columns} rows={results} keyField="course_id" />
 */

import clsx from 'clsx'
import { EmptyState } from './States'
import styles from './DataTable.module.css'

export default function DataTable({
  columns = [],
  rows = [],
  keyField = 'id',
  emptyTitle = 'No data',
  emptyMessage,
  className,
}) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className={clsx(styles.wrap, className)}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}