import Switch from '@mui/material/Switch'
import { type UserProfile } from '../types/types'

const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#1A7A8A',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#1A7A8A',
  },
};

interface SettingsTabProps {
  emailNotifications: boolean
  setEmailNotifications: (value: boolean) => void
  criticalAlerts: boolean
  setCriticalAlerts: (value: boolean) => void
  offlineMode: boolean
  setOfflineMode: (value: boolean) => void
  user: UserProfile
  setToast: (toast: { message: string; type: 'success' | 'info' } | null) => void
}

export default function SettingsTab({
  emailNotifications,
  setEmailNotifications,
  criticalAlerts,
  setCriticalAlerts,
  offlineMode,
  setOfflineMode,
  user,
  setToast
}: SettingsTabProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
      <div>
        <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Account & Settings</h3>
        <p className="text-[13px] text-gray-400 font-medium">Manage your profile, hospital preferences, and security settings</p>
      </div>
      <div className="divide-y divide-gray-100 max-w-xl">
        <div className="py-4 flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-[#1B2D5E]">Email Notifications</span>
            <p className="text-xs text-gray-400 font-medium">Receive daily schedule summaries via email</p>
          </div>
          <Switch
            checked={emailNotifications}
            onChange={(e) => {
              setEmailNotifications(e.target.checked)
              setToast({
                message: e.target.checked
                  ? `Email notifications enabled for ${user.email}`
                  : "Email notifications disabled",
                type: "success"
              })
            }}
            sx={switchSx}
          />
        </div>
        <div className="py-4 flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-[#1B2D5E]">Critical Alerts</span>
            <p className="text-xs text-gray-400 font-medium">Show alert when a patient vital is critical</p>
          </div>
          <Switch
            checked={criticalAlerts}
            onChange={(e) => {
              setCriticalAlerts(e.target.checked)
              setToast({
                message: e.target.checked ? "Critical alerts enabled" : "Critical alerts disabled",
                type: "success"
              })
            }}
            sx={switchSx}
          />
        </div>
        <div className="py-4 flex justify-between items-center">
          <div>
            <span className="text-sm font-bold text-[#1B2D5E]">Offline Mode</span>
            <p className="text-xs text-gray-400 font-medium">Keep database cached for offline view</p>
          </div>
          <Switch
            checked={offlineMode}
            onChange={(e) => {
              setOfflineMode(e.target.checked)
              setToast({
                message: e.target.checked
                  ? "Offline mode enabled: Database cached"
                  : "Offline mode disabled",
                type: "success"
              })
            }}
            sx={switchSx}
          />
        </div>
      </div>
    </div>
  )
}
