# FamilyLink Design System & Style Guide

## 🎨 Color Palette (Family-Friendly & Warm)

### Primary Colors
```css
/* Blue Family - Trust & Communication */
--primary-50: #f0f9ff;   /* Light backgrounds */
--primary-100: #e0f2fe;  /* Hover states */
--primary-200: #bae6fd;  /* Disabled states */
--primary-300: #7dd3fc;  /* Borders */
--primary-400: #38bdf8;  /* Interactive elements */
--primary-500: #0ea5e9;  /* Primary brand */
--primary-600: #0284c7;  /* Hover primary */
--primary-700: #0369a1;  /* Active primary */
--primary-800: #075985;  /* Text on light */
--primary-900: #0c4a6e;  /* Headings */
```

### Secondary Colors (Warm & Friendly)
```css
/* Orange Family - Warmth & Energy */
--secondary-50: #fef7ed;
--secondary-100: #fdedd3;
--secondary-200: #fed7aa;
--secondary-300: #fdba74;
--secondary-400: #fb923c;
--secondary-500: #f97316;  /* Secondary brand */
--secondary-600: #ea580c;
--secondary-700: #c2410c;
--secondary-800: #9a3412;
--secondary-900: #7c2d12;
```

### Success Colors (Green Family)
```css
--success-50: #f0fdf4;
--success-500: #22c55e;   /* Online status, success */
--success-600: #16a34a;
```

### Semantic Colors
```css
/* Messages */
--message-sent: #0ea5e9;      /* User messages */
--message-received: #f1f5f9;  /* Other messages */
--message-system: #64748b;    /* System messages */

/* Status Colors */
--online: #22c55e;     /* Online indicator */
--away: #f59e0b;       /* Away status */
--offline: #64748b;    /* Offline status */
--typing: #8b5cf6;     /* Typing indicator */

/* Interaction Colors */
--like: #ef4444;       /* Heart/like button */
--comment: #3b82f6;    /* Comment button */
--share: #10b981;      /* Share button */
--call-voice: #22c55e; /* Voice call */
--call-video: #3b82f6; /* Video call */
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 320px;   /* Small phones */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Large laptops */
--breakpoint-2xl: 1536px; /* Desktop monitors */
--breakpoint-3xl: 1920px; /* Large monitors */

/* Layout Widths */
--sidebar-mobile: 280px;
--sidebar-desktop: 320px;
--content-max: 1200px;
--chat-list-width: 380px;
--chat-window-min: 400px;
```

## 🔤 Typography Scale

### Font Families
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
```

### Font Sizes (Accessible)
```css
/* Base sizes */
--text-xs: 0.75rem;    /* 12px - Timestamps */
--text-sm: 0.875rem;   /* 14px - Captions */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - Subheadings */
--text-2xl: 1.5rem;    /* 24px - Headings */
--text-3xl: 1.875rem;  /* 30px - Large headings */
--text-4xl: 2.25rem;   /* 36px - Display */

/* Accessibility sizes */
--text-small: 0.875rem;   /* Small setting */
--text-medium: 1rem;      /* Medium setting */
--text-large: 1.125rem;   /* Large setting */
--text-xl-large: 1.25rem; /* XL setting */
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## 🎯 Touch Targets & Spacing

### Touch Targets (WCAG AA Compliant)
```css
--touch-min: 44px;        /* Minimum touch target */
--touch-comfortable: 48px; /* Comfortable touch target */
--touch-large: 56px;      /* Large touch target */
```

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

## 🎭 Border Radius & Shadows

### Border Radius (Friendly & Modern)
```css
--radius-sm: 0.5rem;    /* 8px - Small elements */
--radius-md: 0.75rem;   /* 12px - Buttons */
--radius-lg: 1rem;      /* 16px - Cards */
--radius-xl: 1.5rem;    /* 24px - Large cards */
--radius-2xl: 2rem;     /* 32px - Modals */
--radius-full: 9999px;  /* Circular */
```

### Shadows (Soft & Friendly)
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## 🎬 Animation & Transitions

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Durations
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

## 📐 Layout Grid System

### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│ Header (Global Search + Actions)                        │
├─────────────┬───────────────────────────────────────────┤
│ Sidebar     │ Main Content Area                         │
│ (320px)     │ (Flexible)                               │
│             │                                          │
│ Navigation  │ Messages: Chat List + Chat Window        │
│ + Font      │ Feed: Stories + Posts                    │
│ Controls    │ Create: Content Editor                   │
│             │ Calls: Call List + Actions               │
│             │ Settings: Tabbed Interface               │
└─────────────┴───────────────────────────────────────────┘
```

### Tablet Layout (768px - 1023px)
```
┌─────────────────────────────────────────────────────────┐
│ Header (Hamburger + Search + Actions)                   │
├─────────────────────────────────────────────────────────┤
│ Main Content Area (Full Width)                          │
│                                                         │
│ Adaptive layouts based on content:                      │
│ - Messages: Collapsible panes                          │
│ - Feed: Single column with larger cards                │
│ - Calls: Grid layout                                   │
├─────────────────────────────────────────────────────────┤
│ Bottom Navigation (5 tabs)                             │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (320px - 767px)
```
┌─────────────────────────────────┐
│ Header (Compact)                │
├─────────────────────────────────┤
│ Main Content                    │
│ (Single pane, swipe navigation) │
│                                 │
│ - Messages: Stack navigation    │
│ - Feed: Vertical scroll         │
│ - Create: Full screen editor    │
│ - Calls: List view              │
│ - Settings: Stack navigation    │
├─────────────────────────────────┤
│ Bottom Navigation               │
│ (Touch-optimized)               │
└─────────────────────────────────┘
```

## 🎨 Component Specifications

### Navigation Items
```css
.nav-item {
  min-height: 48px;
  padding: 12px 20px;
  border-radius: 16px;
  transition: all 200ms ease;
}

.nav-item:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: var(--primary-500);
  color: white;
  box-shadow: var(--shadow-lg);
}
```

### Buttons
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  min-height: 48px;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-secondary {
  background: var(--secondary-100);
  color: var(--secondary-700);
  border: 2px solid var(--secondary-200);
}
```

### Cards
```css
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  transition: all 200ms ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

## 🌙 Dark/Light Mode

### Dark Mode Colors
```css
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-primary: #334155;
  --border-secondary: #475569;
}
```

### Light Mode Colors
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --text-tertiary: #64748b;
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;
}
```

## 🎯 Micro-Animations

### Hover States
- **Scale**: 1.02x for buttons, 1.05x for cards
- **Translate**: -2px Y for elevation effect
- **Duration**: 200ms with smooth easing

### Tap/Click States
- **Scale**: 0.95x for immediate feedback
- **Duration**: 150ms with bounce easing

### Loading States
- **Skeleton**: Shimmer effect with 1.5s duration
- **Spinners**: 1s rotation with linear easing
- **Progress**: Smooth fill animation

### Page Transitions
- **Slide**: 300ms with spring easing
- **Fade**: 200ms with smooth easing
- **Scale**: 250ms with bounce easing

## 📱 Platform-Specific Adaptations

### iOS Adaptations
- Rounded corners: 12px minimum
- Safe area insets respected
- Native-like navigation transitions
- Haptic feedback integration

### Android Adaptations
- Material Design 3 principles
- Ripple effects on touch
- System navigation support
- Dynamic color theming

### Desktop Adaptations
- Hover states for all interactive elements
- Keyboard navigation support
- Context menus
- Drag and drop interactions

## 🎨 Icon System

### Icon Sizes
```css
--icon-xs: 16px;   /* Small UI elements */
--icon-sm: 20px;   /* Navigation, buttons */
--icon-md: 24px;   /* Default size */
--icon-lg: 32px;   /* Large buttons */
--icon-xl: 48px;   /* Feature icons */
```

### Icon Colors
- Primary actions: `var(--primary-500)`
- Secondary actions: `var(--text-secondary)`
- Success actions: `var(--success-500)`
- Destructive actions: `#ef4444`
- Disabled state: `var(--text-tertiary)`

This design system ensures consistency, accessibility, and family-friendly aesthetics across all platforms and screen sizes.