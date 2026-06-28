// API base and path helpers
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://korva.kiu.ac.ug'

export const API_PATHS = {
  // Auth
  LOGIN:           '/students/api/auth/v1/login',
  CLAIM:           '/students/api/auth/v1/claim',
  CLAIM_VERIFY:    '/students/api/auth/v1/claim/verify',
  FORGOT_PASSWORD: '/students/api/auth/v1/forgot-password',
  RESET_PASSWORD:  '/students/api/auth/v1/reset-password',
  ME:              '/students/api/auth/v1/me',
  CHANGE_PASSWORD: '/students/api/auth/v1/change-password',
  LOGOUT:          '/students/api/auth/v1/logout',
  // Me
  DASHBOARD:       '/students/api/me/v1/dashboard',
  // Attendance
  ATTENDANCE_ME:   '/students/api/attendance/v1/me',
  CHECKIN:         '/students/api/attendance/v1/check-in',
}

// Cookie name used to persist the token
export const TOKEN_COOKIE = 'kiu_token'