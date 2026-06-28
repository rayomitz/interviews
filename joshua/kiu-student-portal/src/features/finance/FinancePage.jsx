import { useEffect, useState } from 'react'
import { CreditCard, Receipt } from 'lucide-react'
import { Button, Card, ErrorState, LoadingState } from '@/components/ui'
import FinanceKpiGrid from '@/components/portal/FinanceKpiGrid'
import TransactionTable from '@/components/portal/TransactionTable'
import {
  getFinanceSummary,
  getInvoices,
  getPaymentMethods,
  getTransactions,
} from './mockData'
import styles from './FinancePage.module.css'

function formatCurrency(amount, currency = 'UGX') {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function FinancePage() {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  function handleRetry() {
    setLoading(true)
    setError('')
    setRetryKey((key) => key + 1)
  }

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const [summaryRes, txRes, invoiceRes, methodsRes] = await Promise.all([
          getFinanceSummary(),
          getTransactions(),
          getInvoices(),
          getPaymentMethods(),
        ])

        if (!cancelled) {
          setSummary(summaryRes.data.data)
          setTransactions(txRes.data.data)
          setInvoices(invoiceRes.data.data)
          setMethods(methodsRes.data.data)
          setError('')
        }
      } catch {
        if (!cancelled) {
          setError('Could not load finance information. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [retryKey])

  if (loading) {
    return <LoadingState message="Loading finance information..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} retryLabel="Try again" />
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Finance</p>
          <h1>Fees, payments & balances</h1>
          <p>Review invoices, payments, sponsorship, and hostel balances.</p>
        </div>
        <Button icon={CreditCard}>Make payment</Button>
      </section>

      <FinanceKpiGrid
        lifetimePaid={summary.lifetime_paid}
        currentSemesterPaid={summary.current_semester_paid}
        currentSemesterDue={summary.current_semester_due}
        hostelBalance={summary.hostel_balance}
        sponsor={summary.sponsor}
        currency={summary.currency}
      />

      <div className={styles.layout}>
        <Card className={styles.transactionsCard}>
          <div className={styles.sectionHeader}>
            <h2>Transaction history</h2>
          </div>
          <TransactionTable transactions={transactions} currency={summary.currency} />
        </Card>

        <aside className={styles.sideStack}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2>Open invoices</h2>
              <Receipt size={18} />
            </div>
            <div className={styles.invoiceList}>
              {invoices.map((invoice) => (
                <div key={invoice.id} className={styles.invoice}>
                  <div>
                    <strong>{invoice.title}</strong>
                    <span>Due {invoice.due_date}</span>
                  </div>
                  <b>{formatCurrency(invoice.amount_due, invoice.currency)}</b>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2>Payment methods</h2>
            </div>
            <div className={styles.methodList}>
              {methods.map((method) => (
                <div key={method.id} className={styles.method}>
                  <span>{method.label}</span>
                  {method.is_default && <b>Default</b>}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
