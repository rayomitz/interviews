import { useState, useEffect } from 'react'

import {
  User,
  GraduationCap,
  FileText,
  PhoneCall,
  Shield,
  Settings,
  Mail,
  BookOpen,
  BadgeCheck,
} from 'lucide-react'

import { useAuth } from '@/features/auth/AuthContext'
import { getDashboard } from '@/features/dashboard/api'

import {
  Tabs,
  LoadingState,
  ErrorState,
} from '@/components/ui'

import StudentHero from '@/components/portal/StudentHero'
import ProfileSection from '@/components/portal/ProfileSection'
import ComingSoon from '@/components/portal/ComingSoon'

import { formatDate } from '@/lib/formatters'

import styles from './ProfilePage.module.css'


// Tabs
const TABS = [
  { key: 'personal',  label: 'Personal',         icon: User },
  { key: 'academic',  label: 'Academic',          icon: GraduationCap },
  { key: 'documents', label: 'Documents',         icon: FileText },
  { key: 'emergency', label: 'Emergency Contact', icon: PhoneCall },
  { key: 'security',  label: 'Security',          icon: Shield },
  { key: 'prefs',     label: 'Preferences',       icon: Settings },
]

function getGreeting() {

  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'

  return 'Good evening'

}

// Personal Tab
function PersonalTab({ profile = {} }) {
  return (
    <div className={styles.tabContent}>
      <ProfileSection
        title="Personal Details"

        icon={User}

        fields={[

          {
            label: 'Full Name',
            value: profile.name,
          },

          {
            label: 'Student ID',
            value: profile.registration_no,
            highlight: true,
          },

          {
            label: 'Email Address',
            value: profile.email,
          },

          {
            label: 'Phone Number',
            value: profile.phone,
          },

        ]}

      />



      <ProfileSection

        title="Contact Information"

        icon={Mail}

        fields={[

          {
            label: 'Institutional Email',
            value: profile.email,
          },

          {
            label: 'Mobile Phone',
            value: profile.phone,
          },

          {
            label: 'Physical Address',
            value: null,
          },

          {
            label: 'City / District',
            value: null,
          },

        ]}

      />


    </div>

  )

}



// Academic Tab
function AcademicTab({
  programme = {},
  dashboard = {},
}) {


  return (

    <div className={styles.tabContent}>


      <ProfileSection

        title="Academic Snapshot"

        icon={GraduationCap}

        fields={[

          {
            label: 'Programme',
            value: programme.name,
            span: true,
          },

          {
            label: 'Admission Status',
            value: programme.admission_status,
          },

          {
            label: 'Current Status',
            value: dashboard.current_status,
          },

          {
            label: 'Admission Date',

            value:

              dashboard.admission_date

                ? formatDate(
                    dashboard.admission_date,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )

                : null,

          },

          {
            label: 'Study Mode',
            value: null,
          },

          {
            label: 'Campus',
            value: null,
          },

          {
            label: 'Current Semester',
            value: null,
          },

          {
            label: 'Cumulative GPA',
            value: null,
          },

        ]}

      />



      <div className={styles.comingSoonNote}>

        <span className={styles.noteIcon}>

          <BookOpen size={14}/>

        </span>


        Full academic record including GPA history,
        registered courses, and transcript will appear here
        once the results and registration endpoints are available.


      </div>


    </div>

  )

}



// Security Tab
function SecurityTab() {


  return (

    <div className={styles.tabContent}>


      <ProfileSection

        title="Account Security"

        icon={Shield}

        fields={[

          {
            label: 'Password',
            value: '••••••••••••',
          },

          {
            label: 'Last Login',
            value: null,
          },

          {
            label: 'Two-Factor Auth',
            value: 'Not configured',
          },

        ]}

      />



      <div className={styles.securityNote}>


        <BadgeCheck size={16}/>


        <div>

          <p className={styles.securityNoteTitle}>
            Change your password
          </p>


          <p className={styles.securityNoteBody}>

            Password change form is available in Phase 10.
            It will call{' '}

            <code>
              POST /auth/v1/change-password
            </code>

            {' '}and require your current password plus a new password.

          </p>


        </div>


      </div>


    </div>

  )

}




// Main Page
export default function ProfilePage() {


  const { user } = useAuth()


  const [dashboard, setDashboard] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState('personal')





  // Initial page load
  useEffect(() => {


    async function loadDashboard() {


      try {


        const response = await getDashboard()


        setDashboard(response.data.data)



      } catch (err) {


        setError(

          err.response?.data?.message ??

          'Could not load your profile. Please try again.'

        )


      } finally {


        setLoading(false)


      }


    }



    loadDashboard()



  }, [])





  // Retry button
  async function fetchDashboard() {


    setLoading(true)

    setError('')



    try {


      const response = await getDashboard()


      setDashboard(response.data.data)



    } catch (err) {


      setError(

        err.response?.data?.message ??

        'Could not load your profile. Please try again.'

      )



    } finally {


      setLoading(false)


    }


  }





  if (loading)

    return (

      <LoadingState message="Loading your profile…" />

    )





  if (error)

    return (

      <ErrorState

        message={error}

        retryLabel="Try again"

        onRetry={fetchDashboard}

      />

    )





  const profile = dashboard?.profile ?? {}

  const programme = dashboard?.programme ?? {}



  const name =
    profile.name ??
    user?.name ??
    ''



  const registrationNo =
    profile.registration_no ??
    user?.registration_no ??
    ''



  function renderTab() {


    switch(activeTab) {


      case 'personal':

        return (

          <PersonalTab profile={profile}/>

        )



      case 'academic':

        return (

          <AcademicTab

            programme={programme}

            dashboard={dashboard ?? {}}

          />

        )



      case 'security':

        return <SecurityTab />



      case 'documents':

        return (

          <ComingSoon

            title="Documents"

            description="Upload and view your academic documents here."

          />

        )



      case 'emergency':

        return (

          <ComingSoon

            title="Emergency Contact"

            description="Emergency details will appear here later."

          />

        )



      case 'prefs':

        return (

          <ComingSoon

            title="Preferences"

            description="Preferences will be configurable here later."

          />

        )


      default:

        return null

    }

  }





  return (

    <div className={styles.page}>


      <StudentHero

        greeting={getGreeting()}

        name={name}

        registrationNo={registrationNo}

        programme={programme.name ?? ''}

        admissionStatus={programme.admission_status ?? ''}

        currentStatus={dashboard?.current_status ?? ''}

        admissionDate={dashboard?.admission_date ?? ''}

      />



      <div className={styles.tabsWrap}>


        <Tabs

          tabs={TABS}

          active={activeTab}

          onChange={setActiveTab}

        />


      </div>



      <div className={styles.content}>

        {renderTab()}

      </div>



    </div>

  )

}