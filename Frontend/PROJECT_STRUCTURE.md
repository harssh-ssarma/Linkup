# Next.js Project Structure - Linkup Chat App

## 📁 Production-Ready Folder Structure

This project follows Next.js 14+ best practices for scalable, maintainable, and deployment-ready applications.

```
frontend/
├── src/                          # Source code directory
│   ├── app/                      # Next.js App Router pages and layouts
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   ├── page.tsx             # Home page (redirects to /chats)
│   │   ├── chats/               # Chat pages
│   │   │   └── page.tsx         # Main chat interface
│   │   └── api/                 # API routes (if needed)
│   │       └── auth/            # Authentication API routes
│   │
│   ├── components/              # React components organized by purpose
│   │   ├── features/            # Feature-specific components
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── CallSection.tsx
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatSection.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── CreateSection.tsx
│   │   │   ├── FeedSection.tsx
│   │   │   ├── NewChatModal.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   ├── SettingsSection.tsx
│   │   │   └── StoriesBar.tsx
│   │   ├── layout/              # Layout components
│   │   │   └── BottomNavigation.tsx
│   │   └── ui/                  # Reusable UI components
│   │       └── (shared components go here)
│   │
│   ├── lib/                     # External library configurations
│   │   ├── api.ts              # API client configuration
│   │   └── firebase.ts         # Firebase configuration
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts            # Shared types and interfaces
│   │
│   ├── constants/               # Application constants
│   │   └── index.ts            # App-wide constants
│   │
│   ├── utils/                   # Utility functions
│   │   └── index.ts            # Helper functions
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── index.ts            # Shared hooks
│   │
│   └── store/                   # State management (if using Redux/Zustand)
│       └── (store files go here)
│
├── public/                      # Static assets
│   └── chat.jpg
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Key Benefits

### 1. **Scalability**
- Organized by feature and purpose
- Easy to locate and maintain components
- Clear separation of concerns

### 2. **Production Ready**
- Follows Next.js official recommendations
- Optimized for deployment on Vercel, Netlify, etc.
- TypeScript path mapping for clean imports

### 3. **Team Collaboration**
- Consistent structure for all developers
- Clear conventions for new features
- Easy onboarding for new team members

### 4. **Maintainability**
- Centralized types and constants
- Reusable utilities and hooks
- Feature-based component organization

## 📦 Import Patterns

### Using TypeScript Path Mapping

```typescript
// ✅ Clean imports with @/ alias
import ChatList from '@/components/features/ChatList'
import { cn } from '@/utils'
import { CHAT_TYPES } from '@/constants'
import type { ChatProps } from '@/types'

// ❌ Avoid relative imports
import ChatList from '../../components/features/ChatList'
```

### Path Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

## 🛠️ Development Guidelines

### Adding New Features

1. **Components**: Add to `src/components/features/`
2. **Types**: Export from `src/types/index.ts`
3. **Constants**: Add to `src/constants/index.ts`
4. **Utilities**: Add to `src/utils/index.ts`
5. **Hooks**: Add to `src/hooks/index.ts`

### Component Organization

```
src/components/
├── features/       # Business logic components
├── layout/         # Layout and navigation
└── ui/            # Pure UI components (buttons, inputs, etc.)
```

### File Naming Conventions

- **Components**: PascalCase (`ChatWindow.tsx`)
- **Pages**: lowercase (`page.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`CHAT_TYPES`)

## 🔧 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Deployment

This structure is optimized for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Google Cloud Platform**
- **Any platform supporting Node.js**

### Build Process

```bash
npm run build    # Production build
npm run start    # Start production server
npm run dev      # Development server
```

## 📝 Additional Notes

1. **CSS Organization**: Global styles in `src/app/globals.css`
2. **Environment Variables**: Use `.env.local` for secrets
3. **Static Assets**: Place in `public/` directory
4. **API Routes**: Optional, place in `src/app/api/`
5. **Middleware**: Place `middleware.ts` in `src/` directory if needed

This structure ensures your application is ready for production deployment and can scale as your team and features grow.
