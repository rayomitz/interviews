
import { TOKEN_COOKIE } from './constants'

/**
 * Save the token as a Secure, SameSite=Strict cookie.
 * The cookie expires in 7 days.
 */
export function saveToken(token) {
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  document.cookie = [
    `${TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Strict',
    // 'Secure', // uncomment when on HTTPS (production)
  ].join('; ')
}

/**
 * Read the token from cookies. Returns null if not found.
 */
export function getToken() {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`))
  if (!match) return null
  return decodeURIComponent(match.split('=')[1])
}

/**
 * Delete the token cookie (logout).
 */
export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}