/**
 * PasswordInput wraps Input with show/hide eye button
 *
 * Usage:
 *   <PasswordInput label="Password" value={pw} onChange={e => setPw(e.target.value)} />
 */

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input'
import styles from './PasswordInput.module.css'

export default function PasswordInput({ label = 'Password', ...rest }) {
  const [show, setShow] = useState(false)

  const toggle = (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setShow((s) => !s)}
      tabIndex={-1}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )

  return (
    <Input
      label={label}
      type={show ? 'text' : 'password'}
      rightElement={toggle}
      {...rest}
    />
  )
}