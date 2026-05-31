import { lazy, Suspense } from 'react'
import { useUserLoginData, type UserProfile } from '../store/userLoginData'

const Dashboard = lazy(() => import('./Dashboard'))
const LoginPage = lazy(() => import('./LoginPage'))

function App() {

  const { userLoginData, setUserLoginData, clearUserLoginData } = useUserLoginData()

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserLoginData(profile)
  }

  const handleLogout = () => {
    clearUserLoginData()
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#EDF3F8]/30">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1A7A8A]/20 border-t-[#1A7A8A]"></div>
        </div>
      }
    >
      {userLoginData ? (
        <Dashboard user={userLoginData} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </Suspense>
  )
}

export default App
