/**
 * Auth API functions
 * All use the shared Axios client from lib/apiClient.js
 * which auto-attaches the Bearer token and handles 401.
 */

import api from '../../lib/apiClient'
import { API_PATHS } from '../../lib/constants'

// POST /auth/v1/login  { registration_no, password }
// Returns: { data: { student_user, token } }
export function loginApi(payload) {
  return api.post(API_PATHS.LOGIN, payload)
}

// POST /auth/v1/claim  { registration_no, email }
// Returns: { data: { message } }
export function claimAccount(payload) {
  return api.post(API_PATHS.CLAIM, payload)
}

// POST /auth/v1/claim/verify  { registration_no, otp, password, password_confirmation }
// Returns: { data: { student_user, token } }
export function verifyClaim(payload) {
  return api.post(API_PATHS.CLAIM_VERIFY, payload)
}

// POST /auth/v1/forgot-password  { registration_no }
// Returns: { data: { message } }
export function forgotPassword(payload) {
  return api.post(API_PATHS.FORGOT_PASSWORD, payload)
}

// POST /auth/v1/reset-password  { registration_no, otp, password, password_confirmation }
// Returns: { data: { message } }
export function resetPassword(payload) {
  return api.post(API_PATHS.RESET_PASSWORD, payload)
}

// GET /auth/v1/me  (Bearer required)
// Returns: { data: { uuid, registration_no, name, email, ... } }
export function getCurrentAccount() {
  return api.get(API_PATHS.ME)
}

// POST /auth/v1/change-password  { current_password, password, password_confirmation }
// Returns: { data: { message } }
export function changePassword(payload) {
  return api.post(API_PATHS.CHANGE_PASSWORD, payload)
}

// POST /auth/v1/logout  (Bearer required)
// Returns: { data: { message } }
export function logoutApi() {
  return api.post(API_PATHS.LOGOUT)
} 

export function getDashboard() {
  return api.get('/students/api/me/v1/dashboard')
} 

export function getAttendance(term) {
  return api.get('/students/api/attendance/v1/me', {
    params: term ? { term } : undefined,
  })
}