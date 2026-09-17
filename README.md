# 💬 Chat Dashboard

A full-stack, real-time messaging application built with **React, TypeScript, Node.js, Express, MongoDB, and Socket.IO**.

Create an account, discover registered users, see who is currently online, and exchange messages instantly — **without refreshing the page**.

---

## ✨ Features

* 🔐 **User Authentication**

  * Register and log in securely
  * Passwords protected with **bcrypt hashing**
  * JWT-based authentication sessions
  * Logout functionality

* 🛡️ **Protected Dashboard**

  * Authenticated users can access the dashboard
  * Logged-out users are automatically redirected to `/login`

* 👥 **User Discovery**

  * View all registered users
  * Search users by name
  * View real-time online/offline status

* 🟢 **Real-Time Presence**

  * Users are marked online when they connect
  * Online status is updated instantly when users disconnect
  * No polling required

* 💬 **One-to-One Messaging**

  * Private conversations between users
  * Complete message history
  * Messages stored persistently in MongoDB

* ⚡ **Real-Time Messaging**

  * Powered by **Socket.IO**
  * Messages are delivered instantly
  * No page refresh required

* 📅 **Message Timestamps**

  * Messages are grouped by day
  * Clear day-separated timestamps inside conversations

* 🔷 **Type Safety**

  * TypeScript used throughout the frontend and backend

---

## 🛠️ Tech Stack

| Layer                   | Technology                       |
| ----------------------- | -------------------------------- |
| Frontend                | React 19 + TypeScript            |
| Build Tool              | Vite                             |
| Routing                 | React Router                     |
| Backend                 | Node.js + Express 5 + TypeScript |
| Database                | MongoDB                          |
| ODM                     | Mongoose                         |
| Authentication          | JWT (`jsonwebtoken`)             |
| Password Hashing        | bcrypt                           |
| Real-Time Communication | Socket.IO                        |
| Linting                 | oxlint                           |

---

## 📁 Project Structure

```text
ChatApp/
│
├── src/                              # React + TypeScript frontend
│   ├── components/                   # Reusable UI components
│   │   ├── Sidebar
│   │   ├── ChatWindow
│   │   ├── Avatar
│   │   └── ProtectedRoute
│   │
│   ├── pages/                        # Application pages
│   │   ├── Login
│   │   ├── Register
│   │   └── Dashboard
│   │
│   ├── context/                      # Global application state
│   │   └── AuthContext
│   │
│   ├── services/                     # API and Socket.IO services
│   │   ├── api.ts
│   │   └── socket.ts
│   │
│   └── types/                        # TypeScript interfaces and types
│
└── server/                           # Node.js + Express backend
    └── src/
        ├── config/                   # Database configuration
        ├── models/                   # Mongoose schemas
        │   ├── User
        │   ├── Conversation
        │   └── Message
        │
        ├── middleware/               # Authentication middleware
        │   └── JWT authentication
        │
        └── routes/                   # REST API routes
            ├── /api/auth
            ├── /api/users
            └── /api/chat
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DETROXxx/ChatApp.git
cd ChatApp
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

---

## 🔐 Environment Variables

Create an environment file for the backend configuration.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Never commit your `.env` file or expose your JWT secret or database credentials publicly.

Make sure `.env` is included in your `.gitignore`.

---

## ▶️ Running the Application

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will start on the configured port.

### Start the Frontend

From the project root:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## 🔄 How It Works

The application follows a full-stack architecture:

```text
┌──────────────────────┐
│      React UI        │
│   TypeScript + Vite  │
└──────────┬───────────┘
           │
      REST API
           │
           ▼
┌──────────────────────┐
│   Express Backend    │
│    Node.js + TS      │
└───────┬────────┬─────┘
        │        │
        │        │ Socket.IO
        │        ▼
        │   Real-Time Events
        │
        ▼
┌──────────────────────┐
│       MongoDB        │
│       Mongoose       │
└──────────────────────┘
```

### Authentication Flow

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in MongoDB
   ↓
JWT generated
   ↓
Authenticated session
   ↓
Protected Dashboard
```

### Messaging Flow

```text
User A
   │
   │ Send message
   ▼
Socket.IO Server
   │
   │ Store message
   ▼
MongoDB
   │
   │ Emit message
   ▼
User B
   │
   ▼
Message appears instantly
```

---

## 🔒 Security

The application implements several security-focused practices:

* Passwords are hashed using **bcrypt**
* Authentication is handled using **JWT**
* Protected routes require authentication
* MongoDB stores persistent user and message data
* Environment variables are used for sensitive configuration
* `.env` should never be committed to GitHub

---

## 🧪 Development

The project is designed to be developed locally first, with the architecture prepared for future containerization and deployment.

Potential future additions include:

* 🐳 Docker containerization
* ☸️ Kubernetes deployment
* ☁️ Cloud deployment
* 🔔 Message notifications
* 📎 File and image sharing
* 👤 User profile customization
* ✍️ Typing indicators
* ✓ Message delivery/read indicators
* 🟢 Improved presence management

---

## 📌 Current Status

**Development — Full-Stack Version**

The application currently includes:

* ✅ React + TypeScript frontend
* ✅ Node.js + Express backend
* ✅ MongoDB integration
* ✅ User authentication
* ✅ JWT sessions
* ✅ Password hashing
* ✅ Protected routes
* ✅ Registered user discovery
* ✅ Online/offline presence
* ✅ One-to-one conversations
* ✅ Persistent message history
* ✅ Socket.IO real-time messaging
* ✅ TypeScript across the stack

---

## 👨‍💻 Author

**Nikhil Raj**

B.Tech Computer Science & Engineering

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
