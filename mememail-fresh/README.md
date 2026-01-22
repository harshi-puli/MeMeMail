Firebase Structure:
users/
  └── {userId}/
      └── reminders/
          └── {reminderId}/
              ├── title: string
              ├── description: string
              ├── dueDate: timestamp
              ├── category: string
              ├── isCompleted: boolean
              ├── createdAt: timestamp
              └── notified: boolean