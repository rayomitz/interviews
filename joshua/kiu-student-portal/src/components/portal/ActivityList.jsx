import { CheckCircle2, CreditCard, BookOpen, Building2, FileText, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/formatters'
import styles from './ActivityList.module.css'

/**
 * Mock recent activity items.
 * Shape matches what the future notifications API is expected to return:
 * {
 *   id: string,
 *   type: 'payment' | 'registration' | 'hostel' | 'result' | 'alert' | 'general',
 *   title: string,
 *   description: string,
 *   date: string,  // ISO date
 *   read: boolean,
 * }
 *
 * When GET /notifications/v1/me is available, replace MOCK_ACTIVITIES with
 * data fetched from that endpoint and pass it in as a prop.
 */
const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'payment',
    title: 'Tuition payment received',
    description: 'UGX 1,200,000 credited for Semester II 2024/25',
    date: '2025-03-10',
    read: true,
  },
  {
    id: '2',
    type: 'registration',
    title: 'Course registration confirmed',
    description: '5 units registered for Semester II 2024/25',
    date: '2025-02-28',
    read: true,
  },
  {
    id: '3',
    type: 'result',
    title: 'Semester I results published',
    description: 'GPA 3.72 — view your full results',
    date: '2025-02-14',
    read: false,
  },
  {
    id: '4',
    type: 'hostel',
    title: 'Hostel reservation approved',
    description: 'Block C, Room 204 — check-in 1 Feb',
    date: '2025-01-25',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Attendance warning',
    description: 'CIT 2103: attendance below 75% threshold',
    date: '2025-03-05',
    read: false,
  },
]

const TYPE_META = {
  payment:      { icon: CreditCard,    color: 'green' },
  registration: { icon: BookOpen,      color: 'blue'  },
  hostel:       { icon: Building2,     color: 'amber' },
  result:       { icon: FileText,      color: 'blue'  },
  alert:        { icon: AlertCircle,   color: 'red'   },
  general:      { icon: CheckCircle2,  color: 'green' },
}

function ActivityItem({ item }) {
  const { icon: Icon, color } = TYPE_META[item.type] ?? TYPE_META.general

  return (
    <div className={`${styles.item} ${!item.read ? styles.unread : ''}`}>
      <div className={`${styles.iconWrap} ${styles[`icon-${color}`]}`}>
        <Icon size={16} />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.desc}>{item.description}</p>
      </div>
      <time className={styles.date}>
        {formatDate(item.date, { day: 'numeric', month: 'short' })}
      </time>
    </div>
  )
}

/**
 * ActivityList
 *
 * Props:
 *   items  array   — activity objects (defaults to MOCK_ACTIVITIES)
 *   limit  number  — max items to show (default 5)
 */
export default function ActivityList({ items = MOCK_ACTIVITIES, limit = 5 }) {
  const visible = items.slice(0, limit)

  return (
    <div className={styles.list}>
      {visible.length === 0 ? (
        <p className={styles.empty}>No recent activity.</p>
      ) : (
        visible.map((item) => <ActivityItem key={item.id} item={item} />)
      )}
    </div>
  )
}