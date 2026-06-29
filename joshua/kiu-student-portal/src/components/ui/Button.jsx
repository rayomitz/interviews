/**
 * Button component
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="secondary" size="sm">Cancel</Button>
 *   <Button variant="ghost" icon={<Trash2 />} />
 *   <Button loading>Saving...</Button>
 *   <Button disabled>Not allowed</Button>
 *   <Button as={Link} to="/some-path">Go somewhere</Button>
 */

import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import styles from './button.module.css'

export default function Button({
  children,
  as: Component = 'button',     // allows <Button as={Link} to="...">
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,                  // pass already-rendered JSX: icon={<QrCode size={16} />}
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <Component
      // only pass type and disabled when rendering a real <button>
      // Link doesn't accept these and React will warn
      {...(Component === 'button' ? { type, disabled: isDisabled } : {})}
      onClick={onClick}
      className={clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
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
    </Component>
  )
}