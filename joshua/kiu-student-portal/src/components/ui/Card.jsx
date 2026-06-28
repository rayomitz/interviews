/**
 * Card neumorphic raised panel
 *
 * Usage:
 *   <Card>content</Card>
 *   <Card padding="lg" clickable onClick={...}>clickable card</Card>
 *   <Card variant="green">green accent card</Card>
 */

import clsx from 'clsx'
import styles from './Card.module.css'

export default function Card({
  children,
  variant = 'default',  // 'default' | 'green' | 'flat'
  padding = 'md',       // 'none' | 'sm' | 'md' | 'lg'
  clickable = false,
  className,
  onClick,
  ...rest
}) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant],
        styles[`pad-${padding}`],
        clickable && styles.clickable,
        className
      )}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}