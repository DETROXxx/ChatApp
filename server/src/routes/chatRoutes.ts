import express from "express";
import Message from "../models/Message";
import authMiddleware from "../middleware/authMiddleware";
import Conversation from "../models/Conversation";
import User from "../models/User";

export default function chatRoutes(io: any) {
  const router = express.Router();

  router.post("/conversations", authMiddleware, async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      if (userId === req.userId) {
        return res.status(400).json({
          message: "You cannot create a conversation with yourself",
        });
      }

      const otherUser = await User.findById(userId);

      if (!otherUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      let conversation = await Conversation.findOne({
        participants: { $all: [req.userId, userId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.userId, userId],
        });
      }

      res.status(200).json({
        message: "Conversation ready",
        conversation,
      });
    } catch (error) {
      console.error("Conversation error:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });

  router.get("/conversations", authMiddleware, async (req, res) => {
    try {
      const conversations = await Conversation.find({
        participants: req.userId,
      })
        .populate("participants", "name email")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

      res.json({
        conversations,
      });
    } catch (error) {
      console.error("Get conversations error:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  });

  router.post(
    "/conversations/:conversationId/messages",
    authMiddleware,
    async (req, res) => {
      try {
        const conversationId = req.params.conversationId as string;
        const { content } = req.body;

        if (!content || !content.trim()) {
          return res.status(400).json({
            message: "Message content is required",
          });
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          return res.status(404).json({
            message: "Conversation not found",
          });
        }

        const isParticipant = conversation.participants.some(
          (participant) => participant.toString() === req.userId
        );

        if (!isParticipant) {
          return res.status(403).json({
            message: "You are not a participant in this conversation",
          });
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: req.userId,
          content: content.trim(),
        });

        conversation.lastMessage = message._id;
        await conversation.save();

        io.to(`conversation:${conversationId}`).emit("newMessage", {
          _id: message._id,
          conversation: conversationId,
          sender: req.userId,
          content: message.content,
          createdAt: message.createdAt,
        });

        res.status(201).json({
          message: "Message sent successfully",
          data: message,
        });
      } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
          message: "Server error",
        });
      }
    }
  );

  router.get(
    "/conversations/:conversationId/messages",
    authMiddleware,
    async (req, res) => {
      try {
        const conversationId = req.params.conversationId as string;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          return res.status(404).json({
            message: "Conversation not found",
          });
        }

        const isParticipant = conversation.participants.some(
          (participant) => participant.toString() === req.userId
        );

        if (!isParticipant) {
          return res.status(403).json({
            message: "You are not a participant in this conversation",
          });
        }

        const messages = await Message.find({
          conversation: conversationId,
        })
          .populate("sender", "name email")
          .sort({ createdAt: 1 });

        res.json({
          messages,
        });
      } catch (error) {
        console.error("Get messages error:", error);

        res.status(500).json({
          message: "Server error",
        });
      }
    }
  );

  return router;
}