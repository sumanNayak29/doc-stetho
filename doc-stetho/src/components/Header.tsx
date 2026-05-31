import SearchIcon from '../assets/icons/SearchIcon'
import BellIcon from '../assets/icons/BellIcon'
import { type UserProfile } from '../types'
import StatusIndicator from './StatusIndicator'

interface HeaderProps {
  user: UserProfile
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Header({ user, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="h-[76px] bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Welcome Text */}
      <div className="flex flex-col">
        <h2 className="text-[20px] font-extrabold tracking-tight text-[#1B2D5E] flex items-center gap-2">
          Welcome, Dr. {user.name.split(' ')[0]}
          <StatusIndicator color="emerald" size="lg" title="Online" />
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Search and Action Bar */}
      <div className="flex items-center gap-6">
        {/* Search Box */}
        <div className="relative flex items-center hidden sm:flex">
          <span className="absolute left-3.5 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search patient, diagnosis..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-64 h-[40px] pl-10 pr-4 rounded-xl border border-gray-200 bg-[#EDF3F8]/50 text-sm text-[#1B2D5E] placeholder-gray-400 focus:outline-none focus:border-[#4DBFBF] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Notification Icon */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100/80 hover:bg-gray-100 transition-colors cursor-pointer text-gray-600">
          <BellIcon />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </button>

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
              <StatusIndicator color="emerald" size="md" title="Online" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium leading-none">{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
