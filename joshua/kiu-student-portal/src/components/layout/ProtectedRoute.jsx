/**
 * ProtectedRoute
 *
 * Wrap any route that requires the student to be logged in.
 * While AuthContext is still checking the saved cookie
 * (isBootstrapping), we show a full-screen loading spinner
 * so the page does not flash to /login incorrectly.
 *
 * Usage in router.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/app/dashboard" element={<DashboardPage />} />
 *     ...
 *   </Route>
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/UseaAuth'
import { LoadingState } from '../ui/States'

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface)',
      }}>
        <LoadingState message="Loading your session..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
