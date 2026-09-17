import User from "./models/User";
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;




const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    socket.data.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Invalid authentication token"));
  }
});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  console.log(`User connected: ${socket.data.userId}`);

  await User.findByIdAndUpdate(socket.data.userId, {
    online: true,
  });

  io.emit("userStatus", {
  userId: socket.data.userId,
  online: true,
});


  socket.on("joinConversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);

    console.log(
      `User ${socket.data.userId} joined conversation ${conversationId}`
    );
  });

  socket.on("disconnect", async () => {
    console.log(`Socket disconnected: ${socket.id}`);

    await User.findByIdAndUpdate(socket.data.userId, {
      online: false,
      lastSeen: new Date(),
    });
    io.emit("userStatus", {
  userId: socket.data.userId,
  online: false,
});
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes(io));

app.get("/", (req, res) => {
    res.json({
        message: "Chat dashboard API running",
    });
});


connectDB();


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Creates our backend server 