/**
 * Topbar
 *
 * Fixed bar at the top of the protected layout.
 * Shows:
 *   - Hamburger menu button (mobile only — opens sidebar)
 *   - Page breadcrumb area (empty for now, filled per-page in Phase 5+)
 *   - Student name + avatar on the right
 */

import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/features/auth/UseaAuth'
import { getInitials } from '../../lib/formatters'
import styles from './Topbar.module.css'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger — visible only on mobile via CSS */}
        <button
          className={styles.hamburger}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Semester context — placeholder, will be dynamic in Phase 6 */}
        <div className="topbar-context">
          <span>KIU</span>
          <span style={{ color: 'var(--line)', fontWeight: 300 }}>·</span>
          <strong>Student Portal</strong>
        </div>
      </div>

      <div className="topbar-right">
        {/* Notification bell — placeholder icon */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
        </button>

        {/* Student avatar */}
        {user && (
          <div className={`neu-avatar ${styles.avatar}`} title={user.name}>
            {getInitials(user.name)}
          </div>
        )}
      </div>
    </header>
  )
}
