import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const user = auth.currentUser

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">MeMeMail!</h1>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </header>
      
      <main className="home-main">
        <div className="welcome-card">
          <h2>Welcome back!</h2>
          <p className="user-email">{user?.email}</p>
          <p className="welcome-message">
            You've successfully logged into MeMeMail! 🎉
          </p>
        </div>

        <div className="content-section">
          <h3>Your Dashboard</h3>
          <p>This is where your content will go!</p>
        </div>
      </main>
    </div>
  )
}

export default Home