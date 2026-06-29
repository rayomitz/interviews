/**
 * PublicRoute
 *
 * Used for pages that should only be visible when NOT logged in
 * (login, claim account, forgot password).
 *
 * If the student is already authenticated, redirect them to
 * the dashboard so they don't see the login screen again.
 *
 * Usage in router.jsx:
 *   <Route element={<PublicRoute />}>
 *     <Route path="/login" element={<LoginPage />} />
 *   </Route>
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { LoadingState } from '../ui/States'

export default function PublicRoute() {
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
        <LoadingState message="Loading..." />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
