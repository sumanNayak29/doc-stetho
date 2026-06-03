import { useState, useEffect, useRef } from 'react'
import SearchIcon from '../assets/icons/SearchIcon'
import BellIcon from '../assets/icons/BellIcon'
import AlertTriangleIcon from '../assets/icons/AlertTriangleIcon'
import CheckCircleIcon from '../assets/icons/CheckCircleIcon'
import StethoscopeIcon from '../assets/icons/StethoscopeIcon'
import { type UserProfile, type Patient } from '../types/types'
import StatusIndicator from './StatusIndicator'
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';


const inputSx = {
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& input': {
    padding: 0,
  }
};

interface HeaderProps {
  user: UserProfile
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: string
  patientsList?: Patient[]
  onPatientClick?: (patient: Patient) => void
  offlineMode?: boolean
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Header({
  user,
  searchQuery,
  setSearchQuery,
  patientsList = [],
  onPatientClick,
  offlineMode = false,
  activeTab
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Retrieve read notification IDs from localStorage
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('docstetho_read_notifications')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Detect click outside to close dropdown
  useEffect(() => {
    if (!dropdownOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

  // Get current critical cases as dynamic notifications
  const criticalPatients = patientsList.filter(p => p.status === 'Critical')

  // Unread notifications are those critical patient IDs not yet marked as read
  const unreadNotifications = criticalPatients.filter(p => !readIds.includes(p.id))
  const unreadCount = unreadNotifications.length

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const updated = [...readIds, id]
    setReadIds(updated)
    try {
      localStorage.setItem('docstetho_read_notifications', JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = () => {
    const allCriticalIds = criticalPatients.map(p => p.id)
    const updated = Array.from(new Set([...readIds, ...allCriticalIds]))
    setReadIds(updated)
    try {
      localStorage.setItem('docstetho_read_notifications', JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
  }

  const handleNotificationClick = (patient: Patient) => {
    // Mark as read
    handleMarkAsRead(patient.id)
    // Close dropdown
    setDropdownOpen(false)
    // Route to patient profile
    if (onPatientClick) {
      onPatientClick(patient)
    }
  }

  return (
    <header className="h-[76px] bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-8 flex items-center justify-between shrink-0 sticky top-0 z-25">
      {/* Welcome Text */}
      <div className="flex flex-col">
        <h2 className="text-[20px] font-extrabold tracking-tight text-[#1B2D5E] flex items-center gap-2">
          Welcome, Dr. {user.name.split(' ')[0]}
          <StethoscopeIcon className="w-5 h-5 text-[#1A7A8A] shrink-0" />
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Search and Action Bar */}
      <div className="flex items-center gap-6">
        {/* Search Box */}
        {
          activeTab === 'Patients' &&
          <div className="relative flex items-center hidden sm:flex">
            <span className="absolute left-3.5 text-gray-400">
              <SearchIcon />
            </span>
            <OutlinedInput
              type="text"
              placeholder="Search patient, diagnosis..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="!w-64 !h-[40px] !pl-10 !pr-4 !rounded-xl !border !border-gray-200 !bg-[#EDF3F8]/50 !text-sm !text-[#1B2D5E] placeholder-gray-400 focus-within:!border-[#4DBFBF] focus-within:!bg-white transition-all duration-200"
              sx={inputSx}
            />
          </div>

        }


        {/* Notification Icon and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Tooltip title="View Alerts" arrow>
            <Button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`!relative !w-10 !h-10 !min-w-0 !flex !items-center !justify-center !rounded-xl !normal-case transition-all duration-200 cursor-pointer ${dropdownOpen
                ? '!bg-[#1A7A8A]/10 !text-[#1A7A8A] !border !border-[#1A7A8A]/20'
                : '!bg-gray-100/80 hover:!bg-gray-100 !border !border-transparent !text-gray-600'
                }`}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Button>
          </Tooltip>

          {/* Notifications Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-gray-200/80 shadow-[0_8px_32px_rgba(27,45,94,0.08)] rounded-2xl p-4.5 z-30 flex flex-col gap-3.5 animate-[slideUp_0.18s_ease_both]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[14px] font-extrabold text-[#1B2D5E]">Alerts & Messages</span>
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    className="!text-[11px] !font-bold !text-[#1A7A8A] hover:!underline cursor-pointer !min-w-0 !p-0 !normal-case"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Alerts List */}
              <div className="max-h-[260px] overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
                {criticalPatients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-[12.5px] font-bold text-[#1B2D5E] mb-0.5">All Systems Clear</span>
                    <p className="text-[11px] text-gray-400 font-medium">No critical cases reported</p>
                  </div>
                ) : (
                  criticalPatients.map(patient => {
                    const isUnread = !readIds.includes(patient.id)
                    return (
                      <div
                        key={patient.id}
                        onClick={() => handleNotificationClick(patient)}
                        className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-150 ${isUnread
                          ? 'bg-red-50/20 hover:bg-red-50/40 border-red-100/50'
                          : 'bg-gray-50/40 hover:bg-gray-50/90 border-transparent'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${isUnread ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                          <AlertTriangleIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[12.5px] font-extrabold text-[#1B2D5E] group-hover:text-[#1A7A8A] transition-colors leading-snug truncate">
                              Critical Alert: {patient.name}
                            </span>
                            {isUnread && (
                              <Button
                                onClick={(e) => handleMarkAsRead(patient.id, e)}
                                className="!text-[9px] !font-extrabold !text-red-500 !bg-red-100/50 !px-1.5 !py-0.5 !rounded hover:!bg-red-100 !shrink-0 !min-w-0 !normal-case"
                                title="Dismiss"
                              >
                                Read
                              </Button>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium mt-1 truncate">
                            {patient.condition} (HR: {patient.vitals.heartRate} bpm)
                          </span>
                          <span className="text-[9.5px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">
                            Room {100 + parseInt(patient.id.replace(/\D/g, '') || '0')} · {patient.time || 'Just now'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1A7A8A] to-[#4DBFBF] text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-sm shadow-[#1A7A8A]/20">
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex flex-col hidden lg:flex">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[14px] font-bold text-[#1B2D5E] leading-none">{user.name}</span>
              {offlineMode ? (
                <StatusIndicator color="gray" size="md" pulse={false} title="Offline Mode Active" />
              ) : (
                <StatusIndicator color="emerald" size="md" title="Online" />
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-medium leading-none">{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
