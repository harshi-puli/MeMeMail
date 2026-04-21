/* imports needed functions from firebase {
collection - the ability fro firebase to access a collection
addDoc - to add a doc to a collection
getDocs - to access information from a doc
doc - lowk idk
updateDoc - update a doc
deleteDoc - delete a doc from a collection
query.- asks for some docs from the collection
serverTimeStamp - Current time when the functions are called. 
} 
*/
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Get the current user's ID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  return user.uid;
};

// Add a new reminder
export const addReminder = async (reminderData) => {
  const userId = getCurrentUserId();
  
  const reminder = {
    title: reminderData.title,
    description: reminderData.description || '',
    dueDate: reminderData.dueDate, // Should be a Firebase Timestamp or Date object
    category: reminderData.category || 'general',
    isCompleted: false,
    createdAt: serverTimestamp(),
    notified: false
  };

  const remindersRef = collection(db, 'users', userId, 'reminders');
  const docRef = await addDoc(remindersRef, reminder);
  
  return { id: docRef.id, ...reminder };
};

// Get all reminders for current user
export const getReminders = async () => {
  const userId = getCurrentUserId();
  
  const remindersRef = collection(db, 'users', userId, 'reminders');
  const q = query(remindersRef, orderBy('dueDate', 'asc'));
  
  const querySnapshot = await getDocs(q);
  const reminders = [];
  
  querySnapshot.forEach((doc) => {
    reminders.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return reminders;
};

// Schedule reminder email via backend
export const scheduleReminderEmail = async (userEmail, reminder) => {
  try {
    const response = await fetch('http://localhost:3001/schedule-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        reminder: reminder,
        dueDate: reminder.dueDate
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule email');
    }
    
    return await response.json();
  } catch (err) {
    console.error('Error scheduling email:', err);
    throw err;
  }
}

// Update a reminder
export const updateReminder = async (reminderId, updates) => {
  const userId = getCurrentUserId();
  
  const reminderRef = doc(db, 'users', userId, 'reminders', reminderId);
  await updateDoc(reminderRef, updates);
  
  return { id: reminderId, ...updates };
};

// Delete a reminder
export const deleteReminder = async (reminderId) => {
  const userId = getCurrentUserId();
  
  const reminderRef = doc(db, 'users', userId, 'reminders', reminderId);
  await deleteDoc(reminderRef);
  
  return reminderId;
};

// Mark reminder as completed
export const toggleReminderComplete = async (reminderId, isCompleted) => {
  return updateReminder(reminderId, { isCompleted });
};

// Get only incomplete reminders
export const getIncompleteReminders = async () => {
  const allReminders = await getReminders();
  return allReminders.filter(reminder => !reminder.isCompleted);
};

// Get only completed reminders
export const getCompletedReminders = async () => {
  const allReminders = await getReminders();
  return allReminders.filter(reminder => reminder.isCompleted);
};