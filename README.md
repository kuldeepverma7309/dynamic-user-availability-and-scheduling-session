# Dynamic User Availability and Event Scheduling System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Email Notifications](#email-notifications)
- [Real-time Notifications](#real-time-notifications)
- [Development Considerations](#development-considerations)
- [Future Enhancements](#future-enhancements)

---

## Introduction
The **Dynamic User Availability and Event Scheduling System** allows users to set their availability, and admins to schedule, update, and manage events in real-time. The system provides email notifications for scheduled, updated, and canceled sessions.

## Features
- **User Availability Management**: Users can create, view, and edit their availability.
- **Event Scheduling**: Admins can schedule events based on user availability.
- **Real-time Updates**: Notifications are pushed to users in real-time when a session is created, updated, or deleted.
- **Email Notifications**: Users receive emails for any event-related updates.
- **Responsive Design**: Frontend adapts to various screen sizes using Tailwind CSS.

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO, Nodemailer
- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Real-time**: Socket.IO
- **Email Service**: Nodemailer (Gmail SMTP)
- **Date Formatting**: date-fns, date-fns-tz for handling date/time manipulation.

## System Architecture

### 1. **Frontend**: 
The frontend is a React app using Redux for global state management. Tailwind CSS is used for styling. Users interact with the availability and scheduling system through intuitive UI components.

### 2. **Backend**:
The backend is powered by Node.js and Express.js. MongoDB is used to store availability and session data. Real-time updates are provided using Socket.IO, and email notifications are handled via Nodemailer.

### 3. **Database**:
MongoDB stores user availability, session data, and timestamps.

### 4. **Real-time**:
Socket.IO ensures that all users in a session receive real-time updates for session creation, updates, or cancellations.

## Folder Structure
backend/
├── config/
│   ├── nodemailer.js
├── controllers/
│   ├── authController.js
│   ├── availabilityController.js
│   └── sessionController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
|   |__ socketMiddleware.js
├── models/
│   ├── Availability.js
│   ├── Session.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── sessionRoutes.js
│   └── availabilityRoute.js
├── .env
├── server.js
├── package.json



frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AvailabilityCard.jsx
│   │   ├── Card.js
│   │   ├── Footer.js
│   │   └── Header.js
|   |   |__ Loader.css
|   |   |__ SessionCard.jsx
|   |__ features/
|   |   |__ slices/
|   |   |   |__ adminSlice.js
|   |   |   |__ authSlice.js
|   |   |   |__ AvailabilitySlice.js
|   |   |   |__ sessionSlice.js
|   |   |___ store.js
│   ├── pages/
│   │   ├── Availability.jsx
│   │   ├── CreateAvailability.jsx
│   │   ├── DAshboard.jsx
│   │   ├── EditSession.jsx
│   │   └── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFouond.jsx
│   │   ├── ScheduleNewSession.jsx
│   │   ├── Session.jsx
│   │   └── Signup.jsx
│   │   └── UpdateSessionStatus.jsx
│   ├── utils/
│   │   ├── randomAvatar.js
│   │   ├── SocketProvider.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── package.json
└── README.md


## Installation and Setup

### Prerequisites
- Node.js installed
- MongoDB installed or access to MongoDB Atlas

### Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend

Install backend dependencies:

npm install


Setup environment variables in a .env file:

MONGO_URI=mongodb://localhost:27017/event-scheduler
JWT_SECRET=dummykuldeepverma
PORT=5000
NODE_ENV=development
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

Run the backend server:

npm run dev



Frontend Setup-

Navigate to the frontend/ folder:
cd frontend
Install frontend dependencies
npm install
Run the React development server:
npm run dev

Email Notifications
Emails are sent for session-related events using the Nodemailer package. Email templates include:

Session Scheduled: Notifies users about a new session.
Session Updated: Informs users of changes to an existing session.
Session Canceled: Notifies users when a session is canceled.
The sendSessionEmail function in the backend handles sending these emails.

const sendSessionEmail = async (to, subject, text) => {
  // Implementation using nodemailer
};


Real-time Notifications
Real-time updates are provided using Socket.IO. Whenever a session is created, updated, or deleted, users in the session receive instant updates.

io.emit('session_update', { sessionId, updatedData });


Development Considerations
Error Handling: Proper error handling is in place for both frontend and backend operations, including email and real-time features.

Scalability: The system is designed with scalability in mind. Additional features such as recurring events or advanced notifications can be easily added.

Security: The app uses JWT authentication to protect API endpoints and sensitive operations. Emails are sent securely using environment variables for the credentials.

Timezone Support: The app handles different timezones using the date-fns-tz package to ensure correct scheduling across regions.

Future Enhancements
Role-based Access Control: Improve the system by adding different user roles (e.g., user, admin).
Advanced Notifications: Implement SMS or push notifications for better user engagement.
Recurring Availability: Add support for recurring availability slots (e.g., daily, weekly).



### How to Use:
- Simply copy the entire content of this `README.md` file and paste it into your `README.md` file.
- Adjust any project-specific details if needed before submitting.