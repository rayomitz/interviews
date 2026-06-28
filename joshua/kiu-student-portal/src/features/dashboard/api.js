import api from '@/lib/apiclient'

export function getDashboard() {
  return api.get('/students/api/me/v1/dashboard')
}
