// src/components/portal/TransactionTable.jsx
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import styles from './TransactionTable.module.css'

function formatCurrency(amount, currency = 'UGX') {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function TransactionTable({ transactions = [], currency = 'UGX' }) {
  if (transactions.length === 0) {
    return <p className={styles.emptyNote}>No transactions recorded yet.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td className={styles.dateCell}>{formatDate(txn.date)}</td>
              <td>{txn.description}</td>
              <td className={styles.methodCell}>{txn.method}</td>
              <td className={txn.type === 'payment' ? styles.amountPayment : styles.amountCharge}>
                {txn.type === 'payment' ? (
                  <ArrowDownLeft size={13} />
                ) : (
                  <ArrowUpRight size={13} />
                )}
                {formatCurrency(txn.amount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}