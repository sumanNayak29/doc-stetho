import { useState } from 'react'
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'

interface UserProfile {
  name: string
  email: string
  picture?: string
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(null)

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  )
}

export default App
