/**
 * Button component
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="secondary" size="sm">Cancel</Button>
 *   <Button variant="ghost" icon={<Trash2 />} />
 *   <Button loading>Saving...</Button>
 *   <Button disabled>Not allowed</Button>
 */

import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import styles from './button.module.css'

export default function Button({
  children,
  variant = 'primary',  // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',          // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon = null,          // lucide icon element shown before children
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className={styles.spinner} />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
    </button>
  )
}