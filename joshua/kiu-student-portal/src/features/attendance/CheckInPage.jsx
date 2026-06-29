import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import { checkIn } from '@/features/attendance/api'
import { Button, Input } from '@/components/ui'
import styles from './CheckInPage.module.css'

/**
 * Generates a stable device identifier stored in sessionStorage.
 * Used as the optional device_id payload field.
 */
function getDeviceId() {
  try {
    let id = sessionStorage.getItem('kiu_device_id')
    if (!id) {
      id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem('kiu_device_id', id)
    }
    return id
  } catch {
    return 'web-unknown'
  }
}

export default function CheckInPage() {
  const navigate = useNavigate()

  const [token, setToken]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)   // { success, courseName, courseCode, message }
  const [fieldError, setFieldError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (!token.trim()) {
      setFieldError('Please enter the session token shown by your lecturer.')
      return
    }

    setLoading(true)
    setFieldError('')
    setResult(null)

    try {
      const res = await checkIn({
        token: token.trim(),
        device_id: getDeviceId(),
      })

      const data = res.data.data
      const isSuccess = data.result === 'captured'

      setResult({
        success:    isSuccess,
        courseName: data.course_name ?? '',
        courseCode: data.course_code ?? '',
        message:    isSuccess
          ? data.message ?? `Check-in recorded for ${data.course_name ?? 'your course'}.`
          : data.message ?? `Check-in failed: ${data.result}`,
      })

      if (isSuccess) setToken('')
    } catch (err) {
      const msg =
        err.response?.data?.data?.message ??
        err.response?.data?.message ??
        'Check-in failed. Please verify the token and try again.'

      setResult({ success: false, message: msg, courseName: '', courseCode: '' })
    } finally {
      setLoading(false)
    }
  }

  function handleTokenChange(e) {
    setToken(e.target.value)
    if (fieldError) setFieldError('')
    if (result)     setResult(null)
  }

  return (
    <div className={styles.page}>

      {/*Back link*/}
      <button
        type="button"
        onClick={() => navigate('/app/attendance')}
        className={styles.backBtn}
      >
        <ArrowLeft size={16} />
        Back to attendance
      </button>

      {/*Card*/}
      <div className={styles.card}>

        {/* Icon + heading */}
        <div className={styles.cardHeader}>
          <div className={styles.iconBubble}>
            <QrCode size={28} />
          </div>
          <div>
            <h1 className={styles.cardTitle}>Session Check-In</h1>
            <p className={styles.cardSub}>
              Enter the token displayed on your lecturer's screen or scan the QR code.
            </p>
          </div>
        </div>

        {/*Result feedback*/}
        {result && (
          <div
            className={`${styles.resultBox} ${
              result.success ? styles.resultSuccess : styles.resultError
            }`}
            role="alert"
          >
            <div className={styles.resultIcon}>
              {result.success
                ? <CheckCircle2 size={22} />
                : <XCircle     size={22} />
              }
            </div>
            <div>
              {result.courseCode && (
                <p className={styles.resultCourse}>
                  {result.courseCode}
                  {result.courseName ? ` — ${result.courseName}` : ''}
                </p>
              )}
              <p className={styles.resultMessage}>{result.message}</p>
            </div>
          </div>
        )}

        {/*Form*/}
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <Input
            label="Session Token"
            name="token"
            type="text"
            autoComplete="off"
            placeholder="e.g. ABC-123456"
            value={token}
            onChange={handleTokenChange}
            error={fieldError}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={<QrCode size={16} />}
            className={styles.submitBtn}
          >
            {loading ? 'Checking in…' : 'Check In'}
          </Button>
        </form>

        {/*Help note*/}
        <p className={styles.helpNote}>
          The token is refreshed each session. If you cannot see the lecturer's
          screen, ask a classmate or your course coordinator.
        </p>
      </div>
    </div>
  )
}