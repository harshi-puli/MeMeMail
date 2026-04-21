import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Listen for authentication state changes and redirect if logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is logged in, redirect to home
        navigate('/home')
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Log in existing user
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        // Create new user
        await createUserWithEmailAndPassword(auth, email, password)
      }
      // Navigation will happen automatically via onAuthStateChanged
      setEmail('')
      setPassword('')
    } catch (err) {
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address')
          break
        case 'auth/user-not-found':
          setError('No account found with this email')
          break
        case 'auth/wrong-password':
          setError('Incorrect password')
          break
        case 'auth/email-already-in-use':
          setError('Email already in use')
          break
        case 'auth/weak-password':
          setError('Password should be at least 6 characters')
          break
        case 'auth/invalid-credential':
          setError('Invalid email or password')
          break
        default:
          setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container letter-bg">
      <div className="mail-wave" aria-hidden="true" />
      <div className="stamp-deco stamp-deco--tl" aria-hidden="true" />
      <div className="stamp-deco stamp-deco--br" aria-hidden="true" />
      <div className="login-card">
        <p className="eyebrow">Welcome back</p>
        <h1 className="title">MeMeMail</h1>
        <p className="subtitle">
          {isLogin ? 'Log in to keep your reminders on track.' : 'Create an account to get started.'}
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
          
          <div className="toggle-mode">
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="toggle-button"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App