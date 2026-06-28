// src/features/hostels/HostelsPage.jsx
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Building2, Search, RotateCcw } from 'lucide-react'
import { getHostels, reserveHostel, HOSTEL_TYPES, HOSTEL_GENDERS } from './mockData'
import HostelCard from '@/components/portal/HostelCard'
import LoadingState from '@/components/ui/LoadingState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import styles from './HostelsPage.module.css'

const INITIAL_FILTERS = { gender: '', room_type: '', maxPrice: '', search: '' }

function buildCleanFilters(f) {
  return {
    gender: f.gender || undefined,
    room_type: f.room_type || undefined,
    maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
    search: f.search || undefined,
  }
}

export default function HostelsPage() {
  const [hostels, setHostels] = useState([])
  const [myReservation, setMyReservation] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reservingId, setReservingId] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  // Use a ref to carry the latest filters into the fetch without making it
  // a dependency of the effect — avoids the set-state-in-effect lint warning
  // while keeping a single fetchHostels implementation.
  const pendingFiltersRef = useRef(INITIAL_FILTERS)

  const fetchHostels = useCallback(async (activeFilters) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getHostels(buildCleanFilters(activeFilters))
      setHostels(res.data.data.hostels)
      setMyReservation(res.data.data.my_reservation)
    } catch {
      setError('We could not load the hostel catalogue. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch — fetchHostels is stable (no deps), so this runs exactly once
  // and never calls setState synchronously inside the effect body itself.
  useEffect(() => {
    fetchHostels(pendingFiltersRef.current)
  }, [fetchHostels])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleApplyFilters(e) {
    e.preventDefault()
    fetchHostels(filters)
  }

  function handleResetFilters() {
    const reset = INITIAL_FILTERS
    setFilters(reset)
    fetchHostels(reset)
  }

  async function handleReserve(hostelId) {
    setReservingId(hostelId)
    setActionMessage(null)
    try {
      const res = await reserveHostel(hostelId)
      const { result, message, reservation } = res.data.data
      setActionMessage({ tone: result === 'reserved' ? 'success' : 'error', text: message })
      if (result === 'reserved') {
        setMyReservation(reservation)
      }
    } catch {
      setActionMessage({ tone: 'error', text: 'Reservation failed. Please try again.' })
    } finally {
      setReservingId(null)
    }
  }

  const availableCount = useMemo(
    () => hostels.filter((h) => h.availability !== 'full').length,
    [hostels]
  )

  if (loading && hostels.length === 0) {
    return <LoadingState message="Loading hostel catalogue…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchHostels(filters)} />
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hostels</h1>
          <p className={styles.subtitle}>
            {availableCount} of {hostels.length} hostels currently accepting reservations
          </p>
        </div>
      </div>

      {myReservation && (
        <div className={styles.reservationBanner}>
          <Building2 size={18} />
          <span>
            You have an active reservation at <strong>{myReservation.hostel_name}</strong> —
            status: {myReservation.status.replace('_', ' ')}.
          </span>
        </div>
      )}

      {actionMessage && (
        <div
          className={
            actionMessage.tone === 'success' ? styles.actionSuccess : styles.actionError
          }
        >
          {actionMessage.text}
        </div>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <form className={styles.filterForm} onSubmit={handleApplyFilters}>
            <h2 className={styles.filterTitle}>Filters</h2>

            <Input
              icon={Search}
              placeholder="Search hostel name…"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />

            <label className={styles.filterLabel}>
              Gender
              <select
                className={styles.select}
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="">Any</option>
                {HOSTEL_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterLabel}>
              Room type
              <select
                className={styles.select}
                value={filters.room_type}
                onChange={(e) => handleFilterChange('room_type', e.target.value)}
              >
                <option value="">Any</option>
                {HOSTEL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterLabel}>
              Max price per semester (UGX)
              <input
                type="number"
                className={styles.numberInput}
                placeholder="e.g. 700000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </label>

            <div className={styles.filterActions}>
              <Button type="submit" size="sm">
                Apply
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
                <RotateCcw size={14} /> Reset
              </Button>
            </div>
          </form>
        </aside>

        <div className={styles.results}>
          {loading && <p className={styles.refreshingNote}>Refreshing results…</p>}

          {hostels.length === 0 ? (
            <div className={styles.emptyState}>
              No hostels match your filters. Try widening your search.
            </div>
          ) : (
            <div className={styles.grid}>
              {hostels.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  name={hostel.name}
                  gender={hostel.gender}
                  roomType={hostel.room_type}
                  pricePerSemester={hostel.price_per_semester}
                  currency={hostel.currency}
                  distanceFromCampusKm={hostel.distance_from_campus_km}
                  availability={hostel.availability}
                  roomsAvailable={hostel.rooms_available}
                  rating={hostel.rating}
                  amenities={hostel.amenities}
                  isReserved={myReservation?.hostel_id === hostel.id}
                  reserving={reservingId === hostel.id}
                  onReserve={() => handleReserve(hostel.id)}
                  onView={() => setActionMessage(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}