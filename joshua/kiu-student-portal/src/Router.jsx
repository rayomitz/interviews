/**
 * router.jsx — all application routes
 *
 * Route structure:
 *   /                         → redirect to /login
 *   /login                    → LoginPage          (public only)
 *   /claim-account            → ClaimAccountPage   (public only)
 *   /claim-account/verify     → ClaimVerifyPage    (public only)
 *   /forgot-password          → ForgotPasswordPage (public only)
 *   /reset-password           → ResetPasswordPage  (public only)
 *   /app/dashboard            → DashboardPage      (protected)
 *   /app/profile              → ProfilePage        (protected)
 *   /app/attendance           → AttendancePage     (protected)
 *   /app/attendance/check-in  → CheckInPage        (protected)
 *   /app/hostels              → HostelsPage        (protected)
 *   /app/registration         → RegistrationPage   (protected)
 *   /app/results              → ResultsPage        (protected)
 *   /app/finance              → FinancePage        (protected)
 *
 * PublicRoute   → redirects to /app/dashboard if already logged in
 * ProtectedRoute → redirects to /login if not logged in
 */

import { createBrowserRouter, Navigate } from 'react-router-dom'

import PublicRoute     from './components/layout/Publicroute'
import ProtectedRoute  from './components/layout/ProtectedRoute'
import AppShell        from './components/layout/AppShell'

// Public pages
import LoginPage          from './features/auth/LoginPage'
import ClaimAccountPage   from './features/auth/ClaimAccountPage'
import ClaimVerifyPage    from './features/auth/ClaimVerifyPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ResetPasswordPage  from './features/auth/ResetPasswordPage'

// Protected pages
import DashboardPage    from './features/dashboard/DashboardPage'
import ProfilePage      from './features/profile/ProfilePage'
import AttendancePage   from './features/attendance/AttendancePage'
import CheckInPage      from './features/attendance/CheckInPage'
import HostelsPage      from './features/hostels/HostelsPage'
import RegistrationPage from './features/registration/RegistrationPage'
import ResultsPage      from './features/results/ResultsPage'
import FinancePage      from './features/finance/FinancePage'

const router = createBrowserRouter([
  // Root redirect
  { path: '/', element: <Navigate to="/login" replace /> },

  // Public routes (redirect to dashboard if already logged in)
  {
    element: <PublicRoute />,
    children: [
      { path: '/login',                element: <LoginPage /> },
      { path: '/claim-account',        element: <ClaimAccountPage /> },
      { path: '/claim-account/verify', element: <ClaimVerifyPage /> },
      { path: '/forgot-password',      element: <ForgotPasswordPage /> },
      { path: '/reset-password',       element: <ResetPasswordPage /> },
    ],
  },

  // Protected routes (redirect to login if not authenticated)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/app/dashboard',           element: <DashboardPage /> },
          { path: '/app/profile',             element: <ProfilePage /> },
          { path: '/app/attendance',          element: <AttendancePage /> },
          { path: '/app/attendance/check-in', element: <CheckInPage /> },
          { path: '/app/hostels',             element: <HostelsPage /> },
          { path: '/app/registration',        element: <RegistrationPage /> },
          { path: '/app/results',             element: <ResultsPage /> },
          { path: '/app/finance',             element: <FinancePage /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/login" replace /> },
])

export default router
