// src/components/portal/FinanceKpiGrid.jsx
import { Wallet, Receipt, Building2, HandCoins } from 'lucide-react'
import styles from './FinanceKpiGrid.module.css'

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const SPONSOR_LABEL = {
  self_sponsored: 'Self-sponsored',
  government: 'Government-sponsored',
  private_sponsor: 'Privately sponsored',
}

export default function FinanceKpiGrid({
  lifetimePaid,
  currentSemesterPaid,
  currentSemesterDue,
  hostelBalance,
  sponsor,
  currency = 'UGX',
}) {
  const items = [
    {
      icon: Wallet,
      label: 'Lifetime paid',
      value: formatCurrency(lifetimePaid, currency),
    },
    {
      icon: Receipt,
      label: 'This semester paid',
      value: formatCurrency(currentSemesterPaid, currency),
      sub: `of ${formatCurrency(currentSemesterDue, currency)} due`,
    },
    {
      icon: Building2,
      label: 'Hostel balance',
      value: formatCurrency(hostelBalance, currency),
      alert: hostelBalance > 0,
    },
    {
      icon: HandCoins,
      label: 'Sponsorship',
      value: SPONSOR_LABEL[sponsor.type] ?? 'Unknown',
      sub: sponsor.name ?? undefined,
    },
  ]

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className={styles.card}>
            <div className={styles.iconWrap}>
              <Icon size={18} />
            </div>
            <div className={styles.textWrap}>
              <p className={item.alert ? styles.valueAlert : styles.value}>{item.value}</p>
              <p className={styles.label}>{item.label}</p>
              {item.sub && <p className={styles.sub}>{item.sub}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}