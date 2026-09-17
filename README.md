Chat Dashboard
A full-stack, real-time messaging app: create an account, see who else is registered and who's online right now, and chat with them instantly — no page refresh required.

Real accounts, not mock data
Real-time, not polling
A real (if small) data model
Type safety throughout

Features
Register / log in / log out, with hashed passwords and JWT sessions
Protected dashboard — logged-out users are redirected to /login
Searchable list of all registered users
Live online/offline status, broadcast the moment a user connects or disconnects
One-on-one conversations with full message history
Real-time message delivery over Socket.IO (no refresh needed)
Day-separated message timestamps in the chat window

Tech stack
Layer	            Technology
Frontend	        React 19 + TypeScript, built with Vite
Routing         	React Router
Backend	          Node.js + Express 5 + TypeScript
Database	        MongoDB, via Mongoose
Auth	            JWT (jsonwebtoken) + password hashing (bcrypt)
Real-time	        Socket.IO (server) + Socket.IO client
Linting	          oxlint (frontend)


ChatApp/
├── src/                    # React + TypeScript frontend
│   ├── components/         # Sidebar, ChatWindow, Avatar, ProtectedRoute
│   ├── pages/               # Login, Register, Dashboard
│   ├── context/             # AuthContext (session + socket lifecycle)
│   ├── services/            # api.ts (REST calls), socket.ts (Socket.IO client)
│   └── types/                # Shared TypeScript interfaces
└── server/                  # Node.js + Express + TypeScript backend
    └── src/
        ├── config/           # MongoDB connection
        ├── models/           # User, Conversation, Message (Mongoose schemas)
        ├── middleware/       # JWT auth middleware
        └── routes/            # /api/auth, /api/users, /api/chat

        

