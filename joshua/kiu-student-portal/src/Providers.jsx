/**
 * providers.jsx
 *
 * Wraps the entire app in all context providers.
 * Currently only AuthProvider. Add more here as needed
 * (e.g. a notification provider in a future phase).
 */

import { AuthProvider } from '../features/auth/AuthContext'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}