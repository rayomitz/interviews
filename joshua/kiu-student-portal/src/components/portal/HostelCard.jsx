// src/components/portal/HostelCard.jsx
import { MapPin, Star, Wifi, ShieldCheck, Users } from 'lucide-react'
import clsx from 'clsx'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import styles from './HostelCard.module.css'

const AVAILABILITY_META = {
  available: { label: 'Available', tone: 'success' },
  limited: { label: 'Limited rooms', tone: 'warning' },
  full: { label: 'Fully booked', tone: 'error' },
}

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function HostelCard({
  name,
  gender,
  roomType,
  pricePerSemester,
  currency = 'UGX',
  distanceFromCampusKm,
  availability,
  roomsAvailable,
  rating,
  amenities = [],
  isReserved = false,
  onReserve,
  onView,
  reserving = false,
}) {
  const meta = AVAILABILITY_META[availability] ?? AVAILABILITY_META.available
  const disabled = availability === 'full' || isReserved

  return (
    <div className={clsx(styles.card, isReserved && styles.cardReserved)}>
      <div className={styles.imagePlaceholder}>
        <Users size={28} className={styles.imageIcon} />
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>{name}</h3>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <MapPin size={14} /> {distanceFromCampusKm} km from campus
          </span>
          <span className={styles.metaItem}>
            <Star size={14} /> {rating.toFixed(1)}
          </span>
        </div>

        <div className={styles.tagsRow}>
          <Badge tone="neutral">{gender}</Badge>
          <Badge tone="neutral">{roomType}</Badge>
        </div>

        <div className={styles.amenities}>
          {amenities.slice(0, 4).map((item) => (
            <span key={item} className={styles.amenityChip}>
              {item === 'Wi-Fi' ? <Wifi size={12} /> : <ShieldCheck size={12} />}
              {item}
            </span>
          ))}
          {amenities.length > 4 && (
            <span className={styles.amenityChip}>+{amenities.length - 4} more</span>
          )}
        </div>

        <div className={styles.footerRow}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatCurrency(pricePerSemester, currency)}</span>
            <span className={styles.priceUnit}>per semester</span>
          </div>
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={onView}>
              View
            </Button>
            <Button
              size="sm"
              onClick={onReserve}
              disabled={disabled}
              loading={reserving}
            >
              {isReserved ? 'Reserved' : 'Reserve'}
            </Button>
          </div>
        </div>

        {availability === 'limited' && !isReserved && (
          <p className={styles.roomsLeftNote}>Only {roomsAvailable} room(s) left</p>
        )}
      </div>
    </div>
  )
}