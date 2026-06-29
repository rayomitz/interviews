/**
 * Tabs component
 *
 * Usage:
 *   const [tab, setTab] = useState('personal')
 *   <Tabs
 *     tabs={[
 *       { key: 'personal', label: 'Personal' },
 *       { key: 'academic', label: 'Academic' },
 *     ]}
 *     active={tab}
 *     onChange={setTab}
 *   />
 */

import clsx from 'clsx'
import styles from './Tabs.module.css'

export default function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={clsx(styles.tab, active === tab.key && styles.active)}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon && <span className={styles.tabIcon}><tab.icon size={14} /></span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}