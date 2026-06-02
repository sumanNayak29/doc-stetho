import DocStethoIcon from '../assets/icons/DocStethoIcon'
import GridIcon from '../assets/icons/GridIcon'
import PatientsIcon from '../assets/icons/PatientsIcon'
import CalendarIcon from '../assets/icons/CalendarIcon'
import BarChartIcon from '../assets/icons/BarChartIcon'
import SettingsIcon from '../assets/icons/SettingsIcon'
import SignOutIcon from '../assets/icons/SignOutIcon'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <aside className="w-[72px] hover:w-64 bg-[#1B2D5E] text-white flex flex-col justify-between shrink-0 shadow-xl z-10 transition-all duration-300 ease-in-out group">
      <div>
        {/* Logo */}
        <div className="p-4 group-hover:p-6 border-b border-white/10 flex items-center gap-3 transition-all duration-300 overflow-hidden">
          <div className="w-10 h-10 bg-white/10 rounded-xl p-1.5 border border-white/15 backdrop-blur-md shrink-0 flex items-center justify-center">
            <DocStethoIcon />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white/60 font-light">doc</span>stetho
            </span>
            <p className="text-[8px] tracking-[1.5px] text-[#4DBFBF] font-semibold uppercase leading-none mt-0.5">PLATFORM</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 group-hover:p-4 flex flex-col gap-1.5 transition-all duration-300">
          {[
            { name: 'Dashboard', icon: <GridIcon /> },
            { name: 'Patients', icon: <PatientsIcon /> },
            { name: 'Appointments', icon: <CalendarIcon /> },
            { name: 'Analytics', icon: <BarChartIcon /> },
            { name: 'Settings', icon: <SettingsIcon /> }
          ].map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3.5 px-3 group-hover:px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 cursor-pointer ${activeTab === item.name
                  ? 'bg-[#1A7A8A] text-white shadow-md shadow-[#1A7A8A]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto">
                {item.name}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer / User Info */}
      <div className="p-3 group-hover:p-4 border-t border-white/10 transition-all duration-300">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-2 px-3 group-hover:px-4 py-3 rounded-xl text-[14.5px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-red-500/15 cursor-pointer"
        >
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <SignOutIcon />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  )
}
