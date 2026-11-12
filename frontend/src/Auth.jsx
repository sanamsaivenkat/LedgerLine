
import { useState } from 'react'
import { Wallet, Eye, EyeOff, ShieldCheck, LoaderCircle } from 'lucide-react'
import { authApi } from './api'

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isLogin = mode === 'login'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const result = await authApi.login(email.trim(), password)
        onLogin(result)
      } else {
        await authApi.register(email.trim(), password)
        setMode('login')
        setPassword('')
        setSuccess('Registration successful! Please log in.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const changeMode = () => {
    setMode(isLogin ? 'register' : 'login')
    setError('')
    setSuccess('')
    setPassword('')
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon"><Wallet size={25} /></div>
          <span>Ledger<span>Line</span></span>
        </div>

        <div className="auth-brand-content">
          <span className="auth-eyebrow">YOUR FINANCES, SIMPLIFIED</span>
          <h1>Banking that moves at your pace.</h1>
          <p>
            Manage your accounts, track transactions, and stay in control
            of your money with LedgerLine.
          </p>

          <div className="auth-feature">
            <div><ShieldCheck size={21} /></div>
            <span>
              <strong>Secure account access</strong>
              <small>Protected authentication for your account.</small>
            </span>
          </div>
        </div>

        <div className="auth-brand-footer">
          © 2026 LedgerLine. All rights reserved.
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <div className="auth-brand-icon"><Wallet size={23} /></div>
            <strong>LedgerLine</strong>
          </div>

          <span className="auth-eyebrow">
            {isLogin ? 'WELCOME BACK' : 'GET STARTED'}
          </span>

          <h2>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>

          <p className="auth-subtitle">
            {isLogin
              ? 'Enter your details to access your banking dashboard.'
              : 'Register with your email and create a secure password.'}
          </p>

          {error && <div className="auth-message auth-error">{error}</div>}
          {success && <div className="auth-message auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              maxLength={255}
              required
            />

            <label htmlFor="auth-password">Password</label>
            <div className="auth-password-field">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={8}
                maxLength={72}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <p className="auth-hint">
                Password must contain at least 8 characters.
              </p>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="auth-spinner" />
                  Please wait...
                </>
              ) : isLogin ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={changeMode}>
              {isLogin ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="auth-security">
            <ShieldCheck size={16} />
            Secure connection to LedgerLine
          </div>
        </div>
      </section>
    </main>
  )
}

export default Auth
