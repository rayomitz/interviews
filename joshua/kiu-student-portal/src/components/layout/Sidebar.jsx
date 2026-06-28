/**
 * Sidebar — navigation links with active highlighting and logout.
 */

import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, CalendarCheck, Building2,
  BookOpen, BarChart2, Wallet, LogOut, GraduationCap,
} from 'lucide-react'
import { useAuth } from '@/features/auth/UseaAuth'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/app/dashboard',    icon: <LayoutDashboard size={17} />, label: 'Dashboard'    },
  { to: '/app/profile',      icon: <User size={17} />,            label: 'My Profile'   },
  { to: '/app/attendance',   icon: <CalendarCheck size={17} />,   label: 'Attendance'   },
  { to: '/app/hostels',      icon: <Building2 size={17} />,       label: 'Hostels'      },
  { to: '/app/registration', icon: <BookOpen size={17} />,        label: 'Registration' },
  { to: '/app/results',      icon: <BarChart2 size={17} />,       label: 'Results'      },
  { to: '/app/finance',      icon: <Wallet size={17} />,          label: 'Finance'      },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <span className={styles.logoIcon}>
          <GraduationCap size={22} color="var(--green-600)" />
        </span>
        <div>
          <div className="sidebar-logo-text">KIU Portal</div>
          <div className="sidebar-logo-sub">Student Self-Service</div>
        </div>
      </div>

      <nav className="sidebar-nav" onClick={onClose}>
        <div className="sidebar-section-label">Main Menu</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className={styles.userRow}>
            <div className={`neu-avatar ${styles.avatar}`}>
              {user.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userReg}>{user.registration_no}</div>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
