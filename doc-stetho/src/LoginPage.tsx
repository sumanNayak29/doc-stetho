import { useState } from 'react'
import './LoginPage.css'
import MailIcon from './assets/icons/MailIcon'

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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3>Unified Patient Records</h3>
                <p>Access complete medical histories in one place</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3>Analytics & Insights</h3>
                <p>Data-driven decisions for better outcomes</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
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
                <span>Remember me for 30 days</span>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn" id="google-login-btn" type="button">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="social-btn" id="microsoft-login-btn" type="button">
              <svg viewBox="0 0 24 24">
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
              Microsoft
            </button>
          </div>

          <p className="signup-prompt">
            New to DocStetho?{' '}
            <a href="#" className="signup-link" id="create-account-link">Create an account</a>
          </p>

          <p className="terms-text">
            By signing in, you agree to our{' '}
            <a href="#" id="terms-link">Terms of Service</a> and{' '}
            <a href="#" id="privacy-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
