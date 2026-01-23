const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Health check endpoint - ADD THIS
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Simple endpoint to schedule an email
app.post('/schedule-reminder', async (req, res) => {
  const { email, reminder, dueDate } = req.body;
  
  console.log('Received request:', { email, reminder, dueDate }); // Debug log
  
  // Convert dueDate to Unix timestamp (SendGrid requirement)
  const sendAt = Math.floor(new Date(dueDate).getTime() / 1000);
  
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Reminder: ${reminder.title}`,
    text: `Hi! This is your reminder for: ${reminder.title}\n\n${reminder.description}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>🔔 Reminder Alert!</h2>
        <h3>${reminder.title}</h3>
        <p>${reminder.description}</p>
        <p><strong>Category:</strong> ${reminder.category}</p>
      </div>
    `,
    sendAt: sendAt, // Schedule the email
  };

  try {
    await sgMail.send(msg);
    console.log('Email scheduled successfully!'); // Debug log
    res.json({ success: true, message: 'Email scheduled!' });
  } catch (error) {
    console.error('Error:', error.response?.body || error); // Better error logging
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});