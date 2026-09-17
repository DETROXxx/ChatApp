import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import type { Message, User } from '../types';
import './DashboardPage.css';
import {
  getUsers,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} from '../services/api';
import { socket } from '../services/socket';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string, Message[]>
  >({});
  const [users, setUsers] = useState<User[]>([]);
  const [conversationIds, setConversationIds] = useState<
    Record<string, string>
  >({});

  // Load users
  useEffect(() => {
    if (!user?.token) return;

    getUsers(user.token)
      .then((data) => {
        const backendUsers: User[] = data.users.map((backendUser: any) => ({
          id: backendUser._id,
          name: backendUser.name,
          email: backendUser.email,
          isOnline: backendUser.online ?? false,
          lastSeen:
            backendUser.lastSeen ?? new Date().toISOString(),
          avatarColor: '#3b82f6',
        }));

        setUsers(backendUsers);

        if (backendUsers.length > 0) {
          setSelectedUserId(backendUsers[0].id);
        }
      })
      .catch((error) => {
        console.error('Failed to load users:', error);
      });
  }, [user]);

  // Load existing conversations
  useEffect(() => {
    if (!user?.token) return;

    getConversations(user.token)
      .then((data) => {
        const mapping: Record<string, string> = {};

        data.conversations.forEach((conversation: any) => {
          const otherUser = conversation.participants.find(
            (participant: any) => participant._id !== user.id
          );

          if (otherUser) {
            mapping[otherUser._id] = conversation._id;
          }
        });

        setConversationIds(mapping);

        console.log('Conversation mapping:', mapping);
      })
      .catch((error) => {
        console.error('Failed to load conversations:', error);
      });
  }, [user]);

  // Create conversation if one does not exist
  useEffect(() => {
    if (!user?.token || !selectedUserId) return;

    if (conversationIds[selectedUserId]) return;

    createConversation(selectedUserId, user.token)
      .then((data) => {
        const conversationId = data.conversation._id;

        setConversationIds((prev) => ({
          ...prev,
          [selectedUserId]: conversationId,
        }));
      })
      .catch((error) => {
        console.error('Failed to create conversation:', error);
      });
  }, [selectedUserId, conversationIds, user]);

  // Join conversation and load previous messages
  useEffect(() => {
    if (!user?.token || !selectedUserId) return;

    const conversationId = conversationIds[selectedUserId];

    if (!conversationId) return;

    // Join Socket.IO room
    socket.emit('joinConversation', conversationId);

    // Load existing messages from MongoDB
    getMessages(conversationId, user.token)
      .then((data) => {
        const backendMessages: Message[] = data.messages.map(
          (message: any) => ({
            id: message._id,
            senderId:
              message.sender._id === user.id
                ? 'me'
                : message.sender._id,
            receiverId:
              message.sender._id === user.id
                ? selectedUserId
                : user.id,
            text: message.content,
            createdAt: message.createdAt,
          })
        );

        setMessagesByUser((prev) => ({
          ...prev,
          [selectedUserId]: backendMessages,
        }));

        console.log('Messages loaded:', backendMessages);
      })
      .catch((error) => {
        console.error('Failed to load messages:', error);
      });
  }, [selectedUserId, conversationIds, user]);

  useEffect(() => {
  const handleUserStatus = (status: {
    userId: string;
    online: boolean;
  }) => {
    setUsers((prevUsers) =>
      prevUsers.map((currentUser) =>
        currentUser.id === status.userId
          ? {
              ...currentUser,
              isOnline: status.online,
              lastSeen: status.online
                ? currentUser.lastSeen
                : new Date().toISOString(),
            }
          : currentUser
      )
    );
  };

  socket.on("userStatus", handleUserStatus);

  return () => {
    socket.off("userStatus", handleUserStatus);
  };
}, []);

  // Listen for real-time messages
  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (!selectedUserId || !user?.id) return;

      const currentConversationId =
        conversationIds[selectedUserId];

      if (message.conversation !== currentConversationId) {
        return;
      }

      const newMessage: Message = {
        id: message._id,
        senderId:
          message.sender === user.id
            ? 'me'
            : message.sender,
        receiverId:
          message.sender === user.id
            ? selectedUserId
            : user.id,
        text: message.content,
        createdAt: message.createdAt,
      };

      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUserId]: [
          ...(prev[selectedUserId] ?? []),
          newMessage,
        ],
      }));
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedUserId, conversationIds, user]);

  const selectedUser =
    users.find((u) => u.id === selectedUserId) ?? null;

  const activeMessages = selectedUserId
    ? messagesByUser[selectedUserId] ?? []
    : [];

  // Send message
  const handleSend = async (text: string) => {
    if (!selectedUserId || !user?.token) return;

    const conversationId = conversationIds[selectedUserId];

    if (!conversationId) return;

    try {
      await sendMessage(
        conversationId,
        text,
        user.token
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <Sidebar
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
        currentUserName={user?.name ?? 'You'}
        onLogout={handleLogout}
      />

      <ChatWindow
        user={selectedUser}
        messages={activeMessages}
        onSend={handleSend}
      />
    </div>
  );
}