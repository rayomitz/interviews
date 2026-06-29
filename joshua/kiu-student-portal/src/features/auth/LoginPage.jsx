import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Building2,
  CreditCard,
  GraduationCap,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import { loginApi } from '@/features/auth/api'
import { Button, Input, PasswordInput, Checkbox } from '@/components/ui'
import styles from './LoginPage.module.css'

// Quick-link cards shown on the left marketing pnel
const QUICK_LINKS = [
  {
    icon: Building2,
    label: 'Hostel Booking',
    description: 'Reserve your room for next semester',
  },
  {
    icon: BookOpen,
    label: 'Course Registration',
    description: 'Register units before the deadline',
  },
  {
    icon: CreditCard,
    label: 'Tuition Payment',
    description: 'Pay fees and view your balance',
  },
  {
    icon: GraduationCap,
    label: 'View Results',
    description: 'Check grades and download transcript',
  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [fields, setFields] = useState({ registration_no: '', password: '' })
  const [rememberDevice, setRememberDevice] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear per-field error as the user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (globalError) setGlobalError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Basic client-side guard
    const errs = {}
    if (!fields.registration_no.trim()) errs.registration_no = 'Student ID is required.'
    if (!fields.password) errs.password = 'Password is required.'
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    setLoading(true)
    setGlobalError('')
    setFieldErrors({})

    try {
      const res = await loginApi({
        registration_no: fields.registration_no.trim(),
        password: fields.password,
      })

      const { token, student_user } = res.data.data
      login(token, student_user)
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status

      if (status === 422) {
        // Laravel field-level validation errors
        const laravelErrors = err.response?.data?.errors ?? {}
        const mapped = {}
        for (const [field, messages] of Object.entries(laravelErrors)) {
          mapped[field] = Array.isArray(messages) ? messages[0] : messages
        }
        setFieldErrors(mapped)
      } else if (status === 429) {
        setGlobalError('Too many attempts. Please wait a moment before trying again.')
      } else {
        const msg =
          err.response?.data?.error?.message ??
          err.response?.data?.message ??
          'Login failed. Please check your credentials and try again.'
        setGlobalError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.shell}>
      {/*LEFT PANEL*/}
      <aside className={styles.panel}>
        <div className={styles.panelInner}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoMark}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div className={styles.brandName}>KIU Student Portal</div>
              <div className={styles.brandSub}>Kampala International University</div>
            </div>
          </div>

          {/* Hero copy */}
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>Your academic life, in one place.</h1>
            <p className={styles.heroBody}>
              Register units, track attendance, manage your fees, and check your results
              all from a single secure portal.
            </p>
          </div>

          {/* Quick-link cards */}
          <div className={styles.quickGrid}>
            {QUICK_LINKS.map(({ icon: Icon, label, description }) => (
              <div key={label} className={styles.quickCard}>
                <div className={styles.quickIcon}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className={styles.quickLabel}>{label}</div>
                  <div className={styles.quickDesc}>{description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom footnote */}
          <p className={styles.panelFooter}>
            New student?{' '}
            <Link to="/claim-account" className={styles.panelLink}>
              Claim your account
            </Link>
          </p>
        </div>
      </aside>

      {/*RIGHT PANEL SIGN-IN FORM*/}
      <main className={styles.formSide}>
        <div className={styles.formCard}>
          {/* Mobile logo (hidden on desktop) */}
          <div className={styles.mobileBrand}>
            <div className={styles.logoMark}>
              <GraduationCap size={22} />
            </div>
            <span className={styles.brandName}>KIU Student Portal</span>
          </div>

          <h2 className={styles.formTitle}>Sign in</h2>
          <p className={styles.formSub}>
            Use your student ID or institutional email and password.
          </p>

          {/* Global error banner */}
          {globalError && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={16} />
              <span>{globalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <Input
              label="Student ID or Email"
              name="registration_no"
              type="text"
              autoComplete="username"
              placeholder="e.g. KIU/2021/0456"
              value={fields.registration_no}
              onChange={handleChange}
              error={fieldErrors.registration_no}
              disabled={loading}
            />

            <PasswordInput
              label="Password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              error={fieldErrors.password}
              disabled={loading}
            />

            <div className={styles.formRow}>
              <Checkbox
                label="Remember this device"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                disabled={loading}
              />
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className={styles.submitBtn}
            >
              Sign in
            </Button>
          </form>

          <p className={styles.claimHint}>
            First time here?{' '}
            <Link to="/claim-account" className={styles.claimLink}>
              Claim your student account
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
