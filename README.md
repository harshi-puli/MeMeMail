# 📬 MeMeMail

> **Never miss a deadline again.** MeMeMail is an email reminder app that lets you schedule personalized reminder emails to yourself at any date and time you choose.

---

## What It Does

MeMeMail solves a simple but real problem: you probably check your email more reliably than any to-do list. MeMeMail takes advantage of that habit — just add a reminder, pick when you want it delivered, and forget about it. The email lands in your inbox exactly when you need it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js |
| Database | Firebase Realtime Database |
| Email Delivery | SendGrid API |
| Auth | Firebase Authentication |

---

## Features

- **User Authentication** — Secure sign-up and login via Firebase so your reminders stay private
- **Schedule Reminders** — Set a custom date and time for each reminder email
- **SendGrid Delivery** — Reliable email delivery powered by the SendGrid API
- **Persistent Storage** — Reminders are stored in Firebase and survive page refreshes

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- A [Firebase](https://firebase.google.com/) project
- A [SendGrid](https://sendgrid.com/) account with a verified sender email

### Installation

```bash
# Clone the repo
git clone https://github.com/harshi-puli/MeMeMail.git
cd MeMeMail/mememail-fresh

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender@example.com
```

### Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## How It Works

1. **Sign up / Log in** with your email via Firebase Auth
2. **Add a reminder** — write your reminder message and pick a delivery date & time
3. **MeMeMail schedules it** — the backend queues an email via SendGrid for that exact time
4. **Check your inbox** — your reminder arrives right when you need it

---

## Project Structure

```
MeMeMail/
├── mememail-fresh/       # Main React + Vite application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # App pages (Login, Dashboard, etc.)
│   │   └── firebase.js   # Firebase config & initialization
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Roadmap

- [ ] Google Calendar integration
- [ ] Recurring reminders (daily, weekly)
- [ ] Rich text / HTML email templates
- [ ] Mobile app (React Native)

---

## Known Challenges

- **Spam filters** — Scheduled emails sent via SendGrid may occasionally be flagged as spam. Verify your sender domain in SendGrid to improve deliverability.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)

---

*Built by [Harshini Pulivarthi](https://github.com/harshi-puli)*