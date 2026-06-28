// src/features/results/mockData.js
//
// Mock semester results. Shape mirrors the future API described in the
// implementation plan wishlist:
//   GET /students/api/results/v1/semesters
//   GET /students/api/results/v1/transcript

const semesters = [
  {
    term: 'Semester I 2024/25',
    gpa: 3.71,
    credits: 21,
    units: [
      { course_code: 'CIT 2001', course_name: 'Data Structures & Algorithms', credits: 3, grade: 'A-', grade_point: 3.7 },
      { course_code: 'CIT 2003', course_name: 'Web Programming', credits: 3, grade: 'A', grade_point: 4.0 },
      { course_code: 'CIT 2005', course_name: 'Computer Architecture', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'MTH 2001', course_name: 'Linear Algebra', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'STA 2001', course_name: 'Probability & Statistics', credits: 3, grade: 'A-', grade_point: 3.7 },
      { course_code: 'GEN 2001', course_name: 'Entrepreneurship Skills', credits: 3, grade: 'A', grade_point: 4.0 },
      { course_code: 'CIT 2007', course_name: 'Systems Analysis & Design', credits: 3, grade: 'B', grade_point: 3.0 },
    ],
  },
  {
    term: 'Semester II 2023/24',
    gpa: 3.55,
    credits: 18,
    units: [
      { course_code: 'CIT 1801', course_name: 'Object Oriented Programming II', credits: 3, grade: 'A-', grade_point: 3.7 },
      { course_code: 'CIT 1803', course_name: 'Database Fundamentals', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'CIT 1805', course_name: 'Discrete Structures', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'MTH 1801', course_name: 'Calculus II', credits: 3, grade: 'B', grade_point: 3.0 },
      { course_code: 'GEN 1801', course_name: 'Communication Skills I', credits: 3, grade: 'A', grade_point: 4.0 },
      { course_code: 'CIT 1807', course_name: 'Computer Ethics', credits: 3, grade: 'A-', grade_point: 3.7 },
    ],
  },
  {
    term: 'Semester I 2023/24',
    gpa: 3.48,
    credits: 18,
    units: [
      { course_code: 'CIT 1601', course_name: 'Introduction to Programming', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'CIT 1603', course_name: 'Computer Fundamentals', credits: 3, grade: 'A-', grade_point: 3.7 },
      { course_code: 'MTH 1601', course_name: 'Calculus I', credits: 3, grade: 'B', grade_point: 3.0 },
      { course_code: 'MTH 1603', course_name: 'Algebra & Trigonometry', credits: 3, grade: 'B+', grade_point: 3.3 },
      { course_code: 'GEN 1601', course_name: 'Study Skills', credits: 3, grade: 'A', grade_point: 4.0 },
      { course_code: 'GEN 1603', course_name: 'Citizenship & Leadership', credits: 3, grade: 'B+', grade_point: 3.3 },
    ],
  },
]

function computeCumulativeGpa(semesterList) {
  const totalQualityPoints = semesterList.reduce(
    (sum, sem) => sum + sem.gpa * sem.credits,
    0
  )
  const totalCredits = semesterList.reduce((sum, sem) => sum + sem.credits, 0)
  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0
}

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** future: GET /students/api/results/v1/semesters */
export async function getResults() {
  await delay()
  return {
    data: {
      data: {
        cumulative_gpa: Number(computeCumulativeGpa(semesters).toFixed(2)),
        total_credits_earned: semesters.reduce((sum, s) => sum + s.credits, 0),
        semesters,
      },
    },
  }
}

/** future: GET /students/api/results/v1/transcript */
export async function downloadTranscript() {
  await delay(600)
  // Placeholder: in production this should return a blob / signed URL.
  return {
    data: {
      data: {
        result: 'unavailable',
        message:
          'Official transcript downloads are not yet available. This feature will activate once the results API ships.',
      },
    },
  }
}