// src/features/auth/ResetPasswordPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { resetPassword } from './api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './ResetPasswordPage.module.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefillIdentifier = location.state?.identifier ?? ''

  const [identifier, setIdentifier] = useState(prefillIdentifier)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const errors = {}
    if (!identifier.trim()) errors.identifier = 'Enter your student ID or email.'
    if (!code.trim()) errors.code = 'Enter the reset code from your email.'
    if (!password) {
      errors.password = 'Choose a new password.'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.'
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
      const res = await resetPassword({
        registration_no: identifier.trim(),
        otp: code.trim(),
        password,
        password_confirmation: confirmPassword,
      })
      const { result } = res.data?.data ?? {}

      if (result === 'reset' || !result) {
        setSuccess(true)
        return
      }

      if (result === 'expired') {
        setSubmitError('This reset code has expired. Request a new one.')
        return
      }

      if (result === 'invalid') {
        setFieldErrors((prev) => ({ ...prev, code: 'That reset code is incorrect.' }))
        return
      }

      setSubmitError('Something went wrong. Please try again.')
    } catch (err) {
      if (!err?.response) {
        setSubmitError('The KORVA API is not reachable right now. Please check your connection or try again when the server is online.')
        return
      }
      setSubmitError(err?.response?.data?.message ?? 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <CheckCircle2 size={28} />
          </div>
          <h1 className={styles.title}>Password updated</h1>
          <p className={styles.subtitle}>
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Button fullWidth onClick={() => navigate('/login')}>
            Go to sign in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/forgot-password" className={styles.backLink}>
          <ArrowLeft size={16} /> Back
        </Link>

        <div className={styles.iconWrap}>
          <Lock size={28} />
        </div>

        <h1 className={styles.title}>Reset your password</h1>
        <p className={styles.subtitle}>
          Enter the code we emailed you along with your new password.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Student ID or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={fieldErrors.identifier}
            autoComplete="username"
          />

          <Input
            label="Reset code"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={fieldErrors.code}
            inputMode="numeric"
            autoComplete="one-time-code"
          />

          <Input
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />

          {submitError && <p className={styles.submitError}>{submitError}</p>}

          <Button type="submit" loading={loading} fullWidth>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  )
}
