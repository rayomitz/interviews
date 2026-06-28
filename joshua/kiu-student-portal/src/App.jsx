/**
 * App.jsx root component
 *
 * Wraps the router in all providers.
 * This is the only file that ties everything together.
 *
 * Structure:
 *   <Providers>        AuthContext (and future providers)
 *     <RouterProvider> React Router with all routes
 *   </Providers>
 */

import { RouterProvider } from 'react-router-dom'
import Providers from './Providers'
import router   from './Router'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
