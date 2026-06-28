// src/features/auth/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react'
import { forgotPassword } from './api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './ForgotPasswordPage.module.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function validate() {
    if (!identifier.trim()) {
      return 'Enter your student ID or institutional email.'
    }
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validate()
    setFieldError(error)
    if (error) return

    setSubmitError(null)
    setLoading(true)
    try {
      await forgotPassword({ identifier: identifier.trim() })
      // Always show the same success state regardless of whether the
      // identifier matched an account — avoids leaking which accounts exist.
      setSent(true)
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ?? 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <MailCheck size={28} />
          </div>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            If an account matches <strong>{identifier.trim()}</strong>, we've sent password
            reset instructions to the email on file.
          </p>
          <Button fullWidth onClick={() => navigate('/reset-password', { state: { identifier: identifier.trim() } })}>
            I have a reset code
          </Button>
          <Link to="/login" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <div className={styles.iconWrap}>
          <KeyRound size={28} />
        </div>

        <h1 className={styles.title}>Forgot your password?</h1>
        <p className={styles.subtitle}>
          Enter your student ID or institutional email and we'll send you a reset code.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Student ID or email"
            placeholder="2400712345 or you@students.kiu.ac.ug"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={fieldError}
            autoComplete="username"
          />

          {submitError && <p className={styles.submitError}>{submitError}</p>}

          <Button type="submit" loading={loading} fullWidth>
            Send reset code
          </Button>
        </form>
      </div>
    </div>
  )
}