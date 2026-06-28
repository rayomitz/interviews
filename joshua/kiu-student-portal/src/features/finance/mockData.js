// src/features/finance/mockData.js
//
// Mock finance data. Shape mirrors the future API described in the
// implementation plan wishlist:
//   GET  /students/api/finance/v1/summary
//   GET  /students/api/finance/v1/transactions
//   GET  /students/api/finance/v1/invoices
//   POST /students/api/finance/v1/payments/initiate

const summary = {
  currency: 'UGX',
  lifetime_paid: 14250000,
  current_semester_paid: 2850000,
  current_semester_due: 3200000,
  hostel_balance: 850000,
  sponsor: {
    type: 'self_sponsored', // self_sponsored | government | private_sponsor
    name: null,
    coverage_pct: null,
  },
}

const transactions = [
  { id: 'txn_001', date: '2026-06-12', description: 'Tuition installment — Sem II', amount: 1200000, type: 'payment', method: 'Mobile Money' },
  { id: 'txn_002', date: '2026-05-28', description: 'Hostel fee — Freedom Hall', amount: 850000, type: 'payment', method: 'Bank Transfer' },
  { id: 'txn_003', date: '2026-05-02', description: 'Tuition installment — Sem II', amount: 800000, type: 'payment', method: 'Mobile Money' },
  { id: 'txn_004', date: '2026-03-20', description: 'Library fine', amount: 15000, type: 'charge', method: 'Auto-deducted' },
  { id: 'txn_005', date: '2026-02-14', description: 'Tuition installment — Sem II', amount: 850000, type: 'payment', method: 'Card' },
  { id: 'txn_006', date: '2026-01-30', description: 'Functional fees — Sem II', amount: 200000, type: 'payment', method: 'Mobile Money' },
]

const invoices = [
  {
    id: 'inv_2001',
    title: 'Tuition Balance — Semester II 2024/25',
    amount_due: 350000,
    currency: 'UGX',
    due_date: '2026-07-15',
    status: 'open', // open | overdue | paid
  },
  {
    id: 'inv_2002',
    title: 'Hostel Fee Balance — Freedom Hall',
    amount_due: 850000,
    currency: 'UGX',
    due_date: '2026-07-05',
    status: 'overdue',
  },
  {
    id: 'inv_2003',
    title: 'Examination Fee — Semester II 2024/25',
    amount_due: 50000,
    currency: 'UGX',
    due_date: '2026-08-01',
    status: 'open',
  },
]

const paymentMethods = [
  { id: 'pm_mtn', label: 'MTN Mobile Money', type: 'mobile_money', is_default: true },
  { id: 'pm_airtel', label: 'Airtel Money', type: 'mobile_money', is_default: false },
  { id: 'pm_bank', label: 'Bank Transfer (Stanbic)', type: 'bank', is_default: false },
  { id: 'pm_card', label: 'Visa / Mastercard', type: 'card', is_default: false },
]

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** future: GET /students/api/finance/v1/summary */
export async function getFinanceSummary() {
  await delay()
  return { data: { data: summary } }
}

/** future: GET /students/api/finance/v1/transactions */
export async function getTransactions() {
  await delay()
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  return { data: { data: sorted } }
}

/** future: GET /students/api/finance/v1/invoices */
export async function getInvoices() {
  await delay()
  return { data: { data: invoices } }
}

/** future: GET /students/api/finance/v1/payment-methods (not in original wishlist, added for the payment methods section) */
export async function getPaymentMethods() {
  await delay()
  return { data: { data: paymentMethods } }
}

/** future: POST /students/api/finance/v1/payments/initiate */
export async function initiatePayment({ invoiceId, methodId, amount }) {
  await delay(500)
  const invoice = invoices.find((inv) => inv.id === invoiceId)
  const method = paymentMethods.find((m) => m.id === methodId)

  if (!invoice || !method) {
    return {
      data: {
        data: {
          result: 'invalid_request',
          message: 'Invoice or payment method not recognised.',
        },
      },
    }
  }

  return {
    data: {
      data: {
        result: 'initiated',
        message: `Payment of ${amount.toLocaleString()} UGX via ${method.label} has been initiated for "${invoice.title}". Follow the prompt on your device to confirm.`,
        reference: `PMT-${Date.now()}`,
      },
    },
  }
}