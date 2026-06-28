/**
 * useAuth hook — import this in components, NOT AuthContext directly.
 *
 * Split into its own file so React Fast Refresh works correctly.
 * (Fast Refresh requires files to export ONLY components OR only hooks/functions, not both.)
 *
 * Usage:
 *   import { useAuth } from '@/features/auth/useAuth'
 *   const { user, isAuthenticated, login, logout } = useAuth()
 */

import { useContext } from 'react'
import { AuthContext } from './AuthContextValue'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
