// src/features/registration/mockData.js
//
// Mock semester registration data. Shape mirrors the future API described in
// the implementation plan wishlist:
//   GET  /students/api/registration/v1/current
//   POST /students/api/registration/v1/courses
//   DELETE /students/api/registration/v1/courses/{courseId}
//   POST /students/api/registration/v1/confirm

const currentRegistration = {
  term: 'Semester II 2024/25',
  status: 'confirmed', // draft | pending_confirmation | confirmed
  deadline: '2026-07-10',
  total_credits: 18,
  max_credits: 21,
  course_count: 6,
  gpa_projection: 3.62,
  fees_status: 'paid', // paid | partial | unpaid
  courses: [
    {
      course_id: 'crs_101',
      course_code: 'CIT 2103',
      course_name: 'Database Systems',
      credits: 3,
      lecturer: 'Dr. A. Kintu',
      schedule: 'Mon/Wed 09:00–10:30',
      status: 'registered',
    },
    {
      course_id: 'crs_102',
      course_code: 'CIT 2105',
      course_name: 'Operating Systems',
      credits: 3,
      lecturer: 'Mr. P. Otieno',
      schedule: 'Tue/Thu 11:00–12:30',
      status: 'registered',
    },
    {
      course_id: 'crs_103',
      course_code: 'CIT 2107',
      course_name: 'Software Engineering',
      credits: 3,
      lecturer: 'Dr. R. Nansubuga',
      schedule: 'Mon/Wed 13:00–14:30',
      status: 'registered',
    },
    {
      course_id: 'crs_104',
      course_code: 'CIT 2109',
      course_name: 'Computer Networks',
      credits: 3,
      lecturer: 'Mr. D. Mugisha',
      schedule: 'Fri 09:00–12:00',
      status: 'registered',
    },
    {
      course_id: 'crs_105',
      course_code: 'MTH 2101',
      course_name: 'Discrete Mathematics',
      credits: 3,
      lecturer: 'Dr. F. Achen',
      schedule: 'Tue/Thu 08:00–09:30',
      status: 'registered',
    },
    {
      course_id: 'crs_106',
      course_code: 'GEN 2101',
      course_name: 'Communication Skills II',
      credits: 3,
      lecturer: 'Ms. J. Aceng',
      schedule: 'Wed 15:00–17:00',
      status: 'registered',
    },
  ],
}

const registrationHistory = [
  {
    term: 'Semester I 2024/25',
    status: 'completed',
    total_credits: 21,
    course_count: 7,
    gpa: 3.71,
  },
  {
    term: 'Semester II 2023/24',
    status: 'completed',
    total_credits: 18,
    course_count: 6,
    gpa: 3.55,
  },
  {
    term: 'Semester I 2023/24',
    status: 'completed',
    total_credits: 18,
    course_count: 6,
    gpa: 3.48,
  },
]

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** future: GET /students/api/registration/v1/current */
export async function getCurrentRegistration() {
  await delay()
  return { data: { data: currentRegistration } }
}

/** future: GET /students/api/registration/v1/history */
export async function getRegistrationHistory() {
  await delay()
  return { data: { data: registrationHistory } }
}