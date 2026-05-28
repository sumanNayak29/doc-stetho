import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import MailIcon from './assets/icons/MailIcon'
import LockIcon from './assets/icons/LockIcon'
import EyeIcon from './assets/icons/EyeIcon'
import EyeOffIcon from './assets/icons/EyeOffIcon'
import CheckCircleIcon from './assets/icons/CheckCircleIcon'
import BarChartIcon from './assets/icons/BarChartIcon'
import ArrowRightIcon from './assets/icons/ArrowRightIcon'

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; email: string; picture?: string }) => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Extract a nice display name from the email prefix (e.g. john.doe -> John Doe)
      const emailPrefix = email.split('@')[0]
      const displayName = emailPrefix
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      onLoginSuccess({
        name: displayName,
        email: email,
      })
    }, 1500)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google login success:', tokenResponse)
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })
        const userInfo = await res.json()
        console.log('Google User Info:', userInfo)
        onLoginSuccess({
          name: userInfo.name || userInfo.given_name || 'Google User',
          email: userInfo.email,
          picture: userInfo.picture,
        })
      } catch (err) {
        console.error('Failed to fetch user info:', err)
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error)
    },
  })

  const blobBase = "fixed rounded-full pointer-events-none z-0 opacity-[0.18] blur-[80px]"

  return (
    <div className="relative min-h-screen flex font-['Inter',system-ui,sans-serif] overflow-hidden bg-[#EDF3F8]">

      {/* Animated background blobs */}

      <div className={`${blobBase} w-[600px] h-[600px] bg-[radial-gradient(circle,#4DBFBF,#1A7A8A)] -top-[200px] -left-[150px] animate-[blobFloat_14s_ease-in-out_infinite_alternate]`} />
      <div className={`${blobBase} w-[500px] h-[500px] bg-[radial-gradient(circle,#1B2D5E,#1A7A8A)] -bottom-[150px] -right-[100px] animate-[blobFloat_10s_ease-in-out_-4s_infinite_alternate]`} />
      <div className={`${blobBase} w-[350px] h-[350px] bg-[radial-gradient(circle,#4DBFBF,#EDF3F8)] top-[40%] left-[40%] animate-[blobFloat_18s_ease-in-out_-8s_infinite_alternate]`} />
      {/* Left Panel - Branding */}
      <div className="relative z-[1] w-[48%] hidden md:flex items-center justify-center px-12 py-[60px] overflow-hidden bg-[linear-gradient(145deg,#1B2D5E_0%,#1A7A8A_55%,#2AABB0_100%)]
        before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] before:bg-[size:40px_40px] before:pointer-events-none
        after:content-[''] after:absolute after:w-[500px] after:h-[500px] after:rounded-full after:bg-[radial-gradient(circle,rgba(77,191,191,0.15)_0%,transparent_70%)] after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none">

        <div className="relative z-[2] flex flex-col items-start gap-7 max-w-[400px] w-full">

          {/* Logo mark */}
          <div className="w-24 h-24 bg-white/10 rounded-[24px] p-3.5 border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-[logoGrow_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="60" cy="60" r="52" stroke="#4DBFBF" strokeWidth="4" strokeDasharray="12 6" opacity="0.4" />
              <circle cx="60" cy="60" r="42" stroke="#1A7A8A" strokeWidth="5" fill="none" />
              <circle cx="60" cy="60" r="30" fill="#EDF8FA" />
              <rect x="46" y="58" width="7" height="16" rx="1.5" fill="#1A7A8A" />
              <rect x="56" y="50" width="7" height="24" rx="1.5" fill="#1A7A8A" />
              <rect x="66" y="44" width="7" height="30" rx="1.5" fill="#4DBFBF" />
              <polyline points="44,68 54,56 64,50 76,38" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="70,38 76,38 76,44" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="56" y="68" width="8" height="16" rx="1" fill="white" />
              <rect x="52" y="72" width="16" height="8" rx="1" fill="white" />
              <path d="M36 44 Q28 44 28 52 Q28 60 36 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="36" cy="62" r="3" fill="#4DBFBF" />
              <path d="M84 44 Q92 44 92 52 Q92 60 84 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="84" cy="62" r="3" fill="#4DBFBF" />
            </svg>
          </div>

          {/* Brand name */}
          <div className="animate-[slideUp_0.5s_ease_0.1s_both]">
            <h1 className="text-[44px] font-extrabold tracking-[-1.5px] leading-none text-white">
              <span className="text-white/75 font-light">doc</span>
              <span className="text-white font-extrabold">stetho</span>
            </h1>
            <p className="text-[11px] tracking-[2.5px] text-white/55 uppercase mt-2 font-medium">
              DOCTOR'S PATIENT DATA PLATFORM
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.3),transparent)] animate-[slideUp_0.5s_ease_0.2s_both]" />

          {/* Feature list */}
          <div className="flex flex-col gap-5 animate-[slideUp_0.5s_ease_0.3s_both]">
            {[
              { icon: <CheckCircleIcon />, title: 'Unified Patient Records', desc: 'Access complete medical histories in one place' },
              { icon: <BarChartIcon />, title: 'Analytics & Insights', desc: 'Data-driven decisions for better outcomes' },
              { icon: <LockIcon />, title: 'HIPAA Compliant', desc: 'Enterprise-grade security & privacy standards' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 group">
                <div className="w-10 h-10 min-w-[40px] rounded-xl bg-[rgba(77,191,191,0.2)] border border-[rgba(77,191,191,0.35)] flex items-center justify-center text-[#4DBFBF] transition-all duration-200 group-hover:bg-[rgba(77,191,191,0.35)] group-hover:scale-[1.08] [&_svg]:w-[18px] [&_svg]:h-[18px]">
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
                  <p className="text-[12.5px] text-white/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Branding footer */}
          <div className="animate-[slideUp_0.5s_ease_0.4s_both]">
            <p className="text-[13px] text-white/50">
              Trusted by <strong className="text-[#4DBFBF]">5,000+</strong> medical professionals
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative z-[1] flex-1 flex items-center justify-center px-6 py-10">
        <div className="bg-white/85 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_4px_6px_rgba(27,45,94,0.04),0_20px_60px_rgba(27,45,94,0.12),0_0_0_1px_rgba(77,191,191,0.08)] px-10 py-11 w-full max-w-[440px] animate-[cardIn_0.6s_cubic-bezier(0.34,1.3,0.64,1)_0.1s_both]">

          {/* Card Header */}
          <div className="mb-8">
            <h2 className="text-[28px] font-extrabold text-[#1B2D5E] tracking-[-0.8px] mb-1.5">Welcome back</h2>
            <p className="text-sm text-gray-500 font-normal">Sign in to your DocStetho account</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} id="login-form">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[13.5px] font-semibold text-[#1B2D5E] tracking-[0.1px]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 flex items-center text-gray-400 pointer-events-none z-[1] [&_svg]:w-[18px] [&_svg]:h-[18px]">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  className="peer w-full h-[50px] pl-11 pr-11 border-[1.5px] border-gray-200 rounded-xl text-[14.5px] text-[#1B2D5E] bg-white/80 outline-none transition-all duration-200 placeholder:text-[#b0b8c1] placeholder:text-sm focus:border-[#4DBFBF] focus:shadow-[0_0_0_3px_rgba(77,191,191,0.15)] focus:bg-white"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[13.5px] font-semibold text-[#1B2D5E] tracking-[0.1px]">
                  Password
                </label>
                <a href="#" id="forgot-password-link" className="text-[13px] font-medium text-[#1A7A8A] no-underline transition-colors duration-200 hover:text-[#4DBFBF]">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 flex items-center text-gray-400 pointer-events-none z-[1] [&_svg]:w-[18px] [&_svg]:h-[18px]">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="peer w-full h-[50px] pl-11 pr-11 border-[1.5px] border-gray-200 rounded-xl text-[14.5px] text-[#1B2D5E] bg-white/80 outline-none transition-all duration-200 placeholder:text-[#b0b8c1] placeholder:text-sm focus:border-[#4DBFBF] focus:shadow-[0_0_0_3px_rgba(77,191,191,0.15)] focus:bg-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  className="absolute right-3.5 bg-transparent border-none cursor-pointer text-gray-400 flex items-center p-1 rounded-md transition-all duration-200 hover:text-[#1A7A8A] hover:bg-[rgba(77,191,191,0.1)] [&_svg]:w-[18px] [&_svg]:h-[18px]"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer text-[13.5px] text-gray-600 select-none" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className={`w-[18px] h-[18px] min-w-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-[linear-gradient(135deg,#1A7A8A,#4DBFBF)] border-[#4DBFBF]' : 'border-gray-300 bg-white'}`}>
                  {rememberMe && (
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                      <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span>Remember me for 60 days</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="relative w-full h-[52px] border-none rounded-[13px] bg-[linear-gradient(135deg,#1B2D5E_0%,#1A7A8A_60%,#4DBFBF_100%)] text-white text-[15.5px] font-bold tracking-[0.2px] cursor-pointer flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-[180ms] shadow-[0_4px_20px_rgba(26,122,138,0.35)] mt-1 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:transition-transform [&_svg]:duration-200 before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] before:transition-[left] before:duration-500 hover:before:left-full hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_28px_rgba(26,122,138,0.45)] hover:enabled:brightness-[1.08] active:enabled:translate-y-0 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Google Sign-In ── */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={() => googleLogin()}
            className="w-full h-[48px] flex items-center justify-center gap-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[14px] font-semibold text-gray-700 transition-all duration-200 hover:border-[#4DBFBF] hover:shadow-[0_2px_12px_rgba(77,191,191,0.15)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Google 'G' logo */}
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

        </div>
      </div>
    </div>
  )
}

export default LoginPage