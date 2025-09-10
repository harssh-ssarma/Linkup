// Core chat types
export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
  isGroup: boolean;
  isChannel: boolean;
  isPinned: boolean;
  isMuted: boolean;
  isVerified: boolean;
  participantCount?: number;
  lastSeen?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other' | 'ai';
  timestamp: string;
  type: 'text' | 'image' | 'audio' | 'video';
  reactions?: string[];
  chatId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  phone?: string;
}

// Chat component props
export interface ChatListProps {
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  chatType: 'personal' | 'groups' | 'channels';
  searchQuery: string;
}

export interface ChatWindowProps {
  chatId: string;
}

export interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

// Navigation types
export interface NavigationTab {
  id: string;
  icon: any;
  label: string;
  href: string;
  badge?: number;
  badgeType?: 'primary' | 'secondary';
}

// Auth types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: AuthUser) => void;
}
