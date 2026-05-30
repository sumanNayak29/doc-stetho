import LoginPage from './LoginPage'
import Dashboard from './Dashboard'
import { useUserLoginData, type UserProfile } from '../store/userLoginData'



function App() {

  const { userLoginData, setUserLoginData, clearUserLoginData } = useUserLoginData()

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserLoginData(profile)
  }

  const handleLogout = () => {
    clearUserLoginData()
  }

  return userLoginData ? (
    <Dashboard user={userLoginData} onLogout={handleLogout} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  )
}

export default App
