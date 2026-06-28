/**
 * Central Axios client.
 *
 * - Sets baseURL from .env
 * - Adds Accept: application/json on every request
 * - Reads the token from cookie and adds Authorization: Bearer header
 * - On 401 response: clears token and redirects to /login
 */

import axios from 'axios'
import { API_BASE } from './constants'
import { getToken, clearToken } from './storage'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

//Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      // Hard redirect so AuthContext resets cleanly
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api