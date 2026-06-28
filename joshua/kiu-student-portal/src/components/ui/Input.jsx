/**
 * Input component
 *
 * Usage:
 *   <Input label="Registration No." placeholder="KIU/2021/0456" />
 *   <Input label="Email" type="email" error="Email is required" />
 *   <Input label="Search" leftIcon={<Search size={15} />} />
 */

import clsx from 'clsx'
import styles from './Input.module.css'

export default function Input({
  label,
  id,
  error,
  hint,
  leftIcon,
  rightElement,
  className,
  ...rest          // all native <input> props (type, value, onChange, placeholder, etc.)
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={clsx(styles.inputWrap, error && styles.hasError)}>
        {leftIcon && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}

        <input
          id={inputId}
          className={clsx(
            styles.input,
            leftIcon && styles.withLeftIcon,
            rightElement && styles.withRightEl
          )}
          {...rest}
        />

        {rightElement && (
          <span className={styles.rightEl}>{rightElement}</span>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}