import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { addReminder, getReminders, deleteReminder, toggleReminderComplete } from './reminderService.js'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const user = auth.currentUser
  
  const [showModal, setShowModal] = useState(false)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('general')

  // Load reminders when component mounts
  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      const data = await getReminders()
      setReminders(data)
    } catch (err) {
      console.error('Error loading reminders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleAddReminder = async (e) => {
    e.preventDefault()
    
    try {
      await addReminder({
        title,
        description,
        dueDate: new Date(dueDate),
        category
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setDueDate('')
      setCategory('general')
      setShowModal(false)
      
      // Reload reminders
      loadReminders()
    } catch (err) {
      console.error('Error adding reminder:', err)
      alert('Failed to add reminder')
    }
  }

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id)
      loadReminders()
    } catch (err) {
      console.error('Error deleting reminder:', err)
    }
  }

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      await toggleReminderComplete(id, !isCompleted)
      loadReminders()
    } catch (err) {
      console.error('Error updating reminder:', err)
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
            You've successfully logged into MeMeMail! Keep track of your important tasks and reminders all in one place.
          </p>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>My Reminders</h3>
            <button onClick={() => setShowModal(true)} className="add-button">
              + Add Reminder
            </button>
          </div>

          {loading ? (
            <p>Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="no-reminders">No reminders yet. Click "Add Reminder" to get started!</p>
          ) : (
            <div className="reminders-list">
              {reminders.map((reminder) => (
                <div key={reminder.id} className={`reminder-card ${reminder.isCompleted ? 'completed' : ''}`}>
                  <div className="reminder-content">
                    <h4>{reminder.title}</h4>
                    {reminder.description && <p>{reminder.description}</p>}
                    <div className="reminder-meta">
                      <span className="due-date">
                        📅 {reminder.dueDate?.toDate?.()?.toLocaleDateString() || 'No date'}
                      </span>
                      <span className="category">{reminder.category}</span>
                    </div>
                  </div>
                  <div className="reminder-actions">
                    <button 
                      onClick={() => handleToggleComplete(reminder.id, reminder.isCompleted)}
                      className="toggle-button"
                    >
                      {reminder.isCompleted ? 'Undo' : 'Complete'}
                    </button>
                    <button 
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Reminder</h2>
            <form onSubmit={handleAddReminder}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Apply to Google internship"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="applications">Applications</option>
                  <option value="meetings">Meetings</option>
                  <option value="deadlines">Deadlines</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home