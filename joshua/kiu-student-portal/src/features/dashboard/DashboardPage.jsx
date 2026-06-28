import { useState, useEffect } from 'react'
import {
  Building2,
  BookOpen,
  CreditCard,
  GraduationCap,
  CalendarCheck,
  LifeBuoy,
} from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { getDashboard } from '@/features/dashboard/api'
import { LoadingState, ErrorState, Card } from '@/components/ui'
import StudentHero from '@/components/portal/StudentHero'
import QuickActionCard from '@/components/portal/QuickActionCard'
import ActivityList from '@/components/portal/ActivityList'
import styles from './DashboardPage.module.css'

//Greeting helper
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

//Quick action definitions
const QUICK_ACTIONS = [
  {
    icon: Building2,
    label: 'Hostels',
    description: 'Browse rooms & reserve',
    to: '/app/hostels',
    accent: 'green',
  },
  {
    icon: BookOpen,
    label: 'Registration',
    description: 'Manage your units',
    to: '/app/registration',
    accent: 'green',
  },
  {
    icon: CreditCard,
    label: 'Finance',
    description: 'Fees, invoices & payments',
    to: '/app/finance',
    accent: 'amber',
  },
  {
    icon: GraduationCap,
    label: 'Results',
    description: 'Grades & transcript',
    to: '/app/results',
    accent: 'blue',
  },
  {
    icon: CalendarCheck,
    label: 'Attendance',
    description: 'Track & check in',
    to: '/app/attendance',
    accent: 'green',
  },
  {
    icon: LifeBuoy,
    label: 'Support',
    description: 'Help & contact',
    to: '#',
    accent: 'blue',
    disabled: true,
  },
]

//Component
export default function DashboardPage() {
  const { user } = useAuth()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchDashboard() {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboard()
      setDashboard(res.data.data)
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        'Could not load your dashboard. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  //Loading
  if (loading) {
    return <LoadingState message="Loading your dashboard…" />
  }

  //Error
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchDashboard}
        retryLabel="Try again"
      />
    )
  }

  // Destructure API data; fall back to AuthContext user for resilience
  const profile = dashboard?.profile ?? {}
  const programme = dashboard?.programme ?? {}

  const name = profile.name ?? user?.name ?? ''
  const registrationNo = profile.registration_no ?? user?.registration_no ?? ''
  const programmeName = programme.name ?? ''
  const admissionStatus = programme.admission_status ?? ''
  const currentStatus = dashboard?.current_status ?? ''
  const admissionDate = dashboard?.admission_date ?? ''

  return (
    <div className={styles.page}>
      {/*Hero*/}
      <StudentHero
        greeting={getGreeting()}
        name={name}
        registrationNo={registrationNo}
        programme={programmeName}
        admissionStatus={admissionStatus}
        currentStatus={currentStatus}
        admissionDate={admissionDate}
      />

      {/*Main grid*/}
      <div className={styles.grid}>
        {/* Quick actions column */}
        <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Quick actions</h2>
          <div className={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.label} {...action} />
            ))}
          </div>
        </section>

        {/* Recent activity column */}
        <section className={styles.activitySection}>
          <Card className={styles.activityCard}>
            <h2 className={styles.sectionTitle}>Recent activity</h2>
            <ActivityList />
          </Card>
        </section>
      </div>
    </div>
  )
}