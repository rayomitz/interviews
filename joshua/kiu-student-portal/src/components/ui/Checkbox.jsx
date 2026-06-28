/**
 * Checkbox
 *
 * Usage:
 *   <Checkbox label="Remember this device" checked={checked} onChange={e => setChecked(e.target.checked)} />
 */

import styles from './Checkbox.module.css'

export default function Checkbox({ label, id, checked, onChange, ...rest }) {
  const cbId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className={styles.wrapper} htmlFor={cbId}>
      <input
        id={cbId}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}