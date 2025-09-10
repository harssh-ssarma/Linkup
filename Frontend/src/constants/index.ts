// App constants
export const APP_NAME = 'Linkup';
export const APP_DESCRIPTION = 'Professional chat application with modern design';

// Chat constants
export const CHAT_TYPES = {
  PERSONAL: 'personal',
  GROUPS: 'groups',
  CHANNELS: 'channels',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

// Navigation routes
export const ROUTES = {
  HOME: '/',
  CHATS: '/chats',
  FEED: '/feed',
  CREATE: '/create',
  CALLS: '/calls',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  XS: 480,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Firebase config keys
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  CHATS: 'chats',
  MESSAGES: 'messages',
} as const;
