import { useState } from 'react'
import './LoginPage.css'
import MailIcon from './assets/icons/MailIcon'
import LockIcon from './assets/icons/LockIcon'
import EyeIcon from './assets/icons/EyeIcon'
import EyeOffIcon from './assets/icons/EyeOffIcon'
import CheckCircleIcon from './assets/icons/CheckCircleIcon'
import BarChartIcon from './assets/icons/BarChartIcon'
import ArrowRightIcon from './assets/icons/ArrowRightIcon'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="login-root">
      {/* Animated background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Left Panel - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="logo-mark">
            {/* SVG logo inline */}
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer ring */}
              <circle cx="60" cy="60" r="52" stroke="#4DBFBF" strokeWidth="4" strokeDasharray="12 6" opacity="0.4" />
              {/* Main stethoscope circle */}
              <circle cx="60" cy="60" r="42" stroke="#1A7A8A" strokeWidth="5" fill="none" />
              {/* Inner circle */}
              <circle cx="60" cy="60" r="30" fill="#EDF8FA" />
              {/* Chart bars */}
              <rect x="46" y="58" width="7" height="16" rx="1.5" fill="#1A7A8A" />
              <rect x="56" y="50" width="7" height="24" rx="1.5" fill="#1A7A8A" />
              <rect x="66" y="44" width="7" height="30" rx="1.5" fill="#4DBFBF" />
              {/* Trend arrow */}
              <polyline points="44,68 54,56 64,50 76,38" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="70,38 76,38 76,44" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Medical cross */}
              <rect x="56" y="68" width="8" height="16" rx="1" fill="white" />
              <rect x="52" y="72" width="16" height="8" rx="1" fill="white" />
              {/* Stethoscope hooks */}
              <path d="M36 44 Q28 44 28 52 Q28 60 36 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="36" cy="62" r="3" fill="#4DBFBF" />
              <path d="M84 44 Q92 44 92 52 Q92 60 84 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="84" cy="62" r="3" fill="#4DBFBF" />
            </svg>
          </div>

          <div className="brand-text">
            <h1 className="brand-name">
              <span className="brand-doc">doc</span>
              <span className="brand-stetho">stetho</span>
            </h1>
            <p className="brand-tagline">DOCTOR'S PATIENT DATA PLATFORM</p>
          </div>

          <div className="branding-divider" />

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleIcon />
              </div>
              <div>
                <h3>Unified Patient Records</h3>
                <p>Access complete medical histories in one place</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <BarChartIcon />
              </div>
              <div>
                <h3>Analytics & Insights</h3>
                <p>Data-driven decisions for better outcomes</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <LockIcon />
              </div>
              <div>
                <h3>HIPAA Compliant</h3>
                <p>Enterprise-grade security & privacy standards</p>
              </div>
            </div>
          </div>

          <div className="branding-footer">
            <p>Trusted by <strong>5,000+</strong> medical professionals</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">Sign in to your DocStetho account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="#" className="forgot-link" id="forgot-password-link">Forgot password?</a>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  id="toggle-password-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              </div>
            </div>

            <div className="form-extras">
              <label className="remember-me" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="checkmark" />
                <span>Remember me for 60 days</span>
              </label>
            </div>

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              id="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
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



        </div>

      </div>
    </div>
  )
}

export default LoginPage
