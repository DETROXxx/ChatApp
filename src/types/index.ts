export interface User {
  id: string;
  name: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string;
  avatarColor: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  text: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}