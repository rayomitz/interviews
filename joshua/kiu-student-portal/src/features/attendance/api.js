import api from '@/lib/apiclient'

export function getAttendance(term) {
  return api.get('/students/api/attendance/v1/me', {
    params: term ? { term } : undefined,
  })
}

export function checkIn(payload) {
  return api.post('/students/api/attendance/v1/check-in', payload)
}
