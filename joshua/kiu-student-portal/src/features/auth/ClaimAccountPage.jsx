// src/features/auth/ClaimAccountPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { claimAccount } from './api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './ClaimAccountPage.module.css'

export default function ClaimAccountPage() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)

  function validate() {
    const errors = {}
    if (!studentId.trim()) {
      errors.studentId = 'Student ID is required.'
    }
    if (!email.trim()) {
      errors.email = 'Institutional email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address.'
    }
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitError(null)
    setLoading(true)
    try {
      const registrationNo = studentId.trim()
      const res = await claimAccount({
        registration_no: registrationNo,
        email: email.trim(),
      })
      const { result } = res.data?.data ?? {}

      if (result === 'sent' || !result) {
        navigate('/claim-account/verify', {
          state: { registrationNo, email: email.trim() },
        })
        return
      }

      if (result === 'already_claimed') {
        setSubmitError('This account has already been claimed. Try signing in instead.')
        return
      }

      if (result === 'not_found') {
        setSubmitError('We could not match that student ID and email. Check your details and try again.')
        return
      }

      setSubmitError('Something went wrong. Please try again.')
    } catch (err) {
      if (!err?.response) {
        setSubmitError('The KORVA API is not reachable right now. Please check your connection or try again when the server is online.')
        return
      }
      const apiMessage = err?.response?.data?.message
      const fieldIssues = err?.response?.data?.errors
      if (fieldIssues) {
        setFieldErrors((prev) => ({
          ...prev,
          studentId: fieldIssues.registration_no?.[0],
          email: fieldIssues.email?.[0],
        }))
      }
      setSubmitError(apiMessage ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <div className={styles.iconWrap}>
          <GraduationCap size={28} />
        </div>

        <h1 className={styles.title}>Claim your student account</h1>
        <p className={styles.subtitle}>
          Enter your student ID and institutional email. We'll send a verification code to
          confirm it's you.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Student ID"
            placeholder="e.g. 2400712345"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            error={fieldErrors.studentId}
            autoComplete="username"
          />

          <Input
            label="Institutional email"
            type="email"
            placeholder="firstname.lastname@students.kiu.ac.ug"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            autoComplete="email"
          />

          {submitError && <p className={styles.submitError}>{submitError}</p>}

          <Button type="submit" loading={loading} fullWidth>
            Send verification code
          </Button>
        </form>

        <p className={styles.footerNote}>
          Already claimed your account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
