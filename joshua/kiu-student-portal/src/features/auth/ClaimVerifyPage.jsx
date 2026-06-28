// src/features/auth/ClaimVerifyPage.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { verifyClaim, claimAccount } from './api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './ClaimVerifyPage.module.css'

const RESEND_COOLDOWN_SECONDS = 30

export default function ClaimVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email ?? null
  const registrationNo = location.state?.registrationNo ?? null

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendNote, setResendNote] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  function startCooldown() {
    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function validate() {
    const errors = {}
    if (!code.trim()) {
      errors.code = 'Enter the verification code.'
    }
    if (!password) {
      errors.password = 'Choose a password.'
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
      const res = await verifyClaim({
        registration_no: registrationNo,
        otp: code.trim(),
        password,
        password_confirmation: confirmPassword,
      })
      const { result } = res.data?.data ?? {}

      if (result === 'verified' || !result) {
        navigate('/login', { state: { claimSuccess: true } })
        return
      }

      if (result === 'expired') {
        setSubmitError('This code has expired. Request a new one below.')
        return
      }

      if (result === 'invalid') {
        setFieldErrors((prev) => ({ ...prev, code: 'That code is incorrect.' }))
        return
      }

      setSubmitError('Something went wrong. Please try again.')
    } catch (err) {
      if (!err?.response) {
        setSubmitError('The KORVA API is not reachable right now. Please check your connection or try again when the server is online.')
        return
      }
      setSubmitError(err.response?.data?.message ?? 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email || !registrationNo) return
    setResendNote(null)
    try {
      await claimAccount({ registration_no: registrationNo, email })
      setResendNote('A new code has been sent to your email.')
      startCooldown()
    } catch {
      setResendNote('Could not resend the code right now. Please try again shortly.')
    }
  }

  if (!email || !registrationNo) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.subtitle}>
            We couldn't find an email to verify. Please start the claim process again.
          </p>
          <Link to="/claim-account" className={styles.backLink}>
            <ArrowLeft size={16} /> Start over
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/claim-account" className={styles.backLink}>
          <ArrowLeft size={16} /> Back
        </Link>

        <div className={styles.iconWrap}>
          <ShieldCheck size={28} />
        </div>

        <h1 className={styles.title}>Verify your email</h1>
        <p className={styles.subtitle}>
          Enter the code we sent to <strong>{email}</strong>, then set a password for your
          account.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Verification code"
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
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />

          {submitError && <p className={styles.submitError}>{submitError}</p>}

          <Button type="submit" loading={loading} fullWidth>
            Verify and set password
          </Button>
        </form>

        <div className={styles.resendRow}>
          {resendNote && <p className={styles.resendNote}>{resendNote}</p>}
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  )
}
