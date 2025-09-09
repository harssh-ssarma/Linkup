# 📱 FamilyLink Responsive Layout Guide

## 🎯 Breakpoint Strategy

### Mobile-First Approach
```css
/* Base styles for mobile (320px+) */
.container { width: 100%; padding: 16px; }

/* Small phones (375px+) */
@media (min-width: 375px) {
  .container { padding: 20px; }
}

/* Large phones (414px+) */
@media (min-width: 414px) {
  .touch-target { min-height: 48px; }
}

/* Tablets (768px+) */
@media (min-width: 768px) {
  .container { max-width: 768px; margin: 0 auto; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .sidebar { display: flex; width: 320px; }
  .main-content { margin-left: 320px; }
}

/* Large desktop (1440px+) */
@media (min-width: 1440px) {
  .container { max-width: 1200px; }
  .sidebar { width: 380px; }
}
```

## 📱 Mobile Layout (320px - 767px)

### Navigation Pattern
```
┌─────────────────────────────────┐
│ 🍔 FamilyLink        🔍 🔊 🌙  │ ← Header (64px)
├─────────────────────────────────┤
│                                 │
│        Main Content             │
│      (Single Pane)              │
│                                 │
│   Swipe ← → for navigation      │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 💬  🏠  ➕  📞  ⚙️           │ ← Bottom Nav (72px)
└─────────────────────────────────┘
```

### Messages Section - Mobile
```
┌─────────────────────────────────┐
│ ← Messages              ➕      │
├─────────────────────────────────┤
│ 🔍 Search conversations...      │
├─────────────────────────────────┤
│ All │ Groups │ Archived         │
├─────────────────────────────────┤
│ 📌 👨‍👩‍👧‍👦 Family Group    2m  │
│    Mom: Dinner ready! 🍽️    3   │
├─────────────────────────────────┤
│ 👨‍🦲 Dad                    15m │
│    Can you pick up groceries?   │
├─────────────────────────────────┤
│ 👧 Sister Emma            1h   │
│    Thanks for help! ❤️          │
└─────────────────────────────────┘
```

### Chat Window - Mobile
```
┌─────────────────────────────────┐
│ ← 👨‍👩‍👧‍👦 Family Group  📞 📹 ⋮ │
├─────────────────────────────────┤
│                                 │
│  👩‍🦳 Mom                    2:30pm │
│  Dinner is ready! 🍽️            │
│                                 │
│                     You  2:32pm │
│                   Coming! 🏃‍♂️   │
│                                 │
│  👨‍🦲 Dad                    2:35pm │
│  Save some for me! 😄           │
│                                 │
├─────────────────────────────────┤
│ Type a message...        📤     │
└─────────────────────────────────┘
```

### Feed Section - Mobile
```
┌─────────────────────────────────┐
│ Family Feed            📷 ➕    │
├─────────────────────────────────┤
│ All │ Family │ Friends          │
├─────────────────────────────────┤
│ Stories ────────────────────→    │
│ 👩‍🦳  👨‍🦲  👧  👵  ➕           │
├─────────────────────────────────┤
│ 👩‍🦳 Mom                    2h   │
│ Beautiful sunset! 🌅             │
│ [────── Image ──────]           │
│ ❤️ 12  💬 3                     │
├─────────────────────────────────┤
│ 👨‍🦲 Dad                    4h   │
│ Fixed the bike! 🚴‍♂️             │
│ ❤️ 8   💬 2                     │
└─────────────────────────────────┘
```

## 📱 Tablet Layout (768px - 1023px)

### Landscape Orientation
```
┌─────────────────────────────────────────────────────────┐
│ 🍔 FamilyLink              🔍 Search...        🔊 🌙   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Main Content Area                      │
│              (Adaptive Two-Pane)                        │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   Chat List     │  │      Chat Window            │   │
│  │                 │  │                             │   │
│  │  👨‍👩‍👧‍👦 Family   │  │  Messages appear here     │   │
│  │  👨‍🦲 Dad        │  │                             │   │
│  │  👧 Emma       │  │                             │   │
│  └─────────────────┘  └─────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│        💬    🏠    ➕    📞    ⚙️                      │
└─────────────────────────────────────────────────────────┘
```

### Portrait Orientation
```
┌─────────────────────────────────┐
│ 🍔 FamilyLink        🔍 🔊 🌙  │
├─────────────────────────────────┤
│                                 │
│        Main Content             │
│     (Single Pane with           │
│    Collapsible Sidebar)         │
│                                 │
│  Swipe from left for sidebar    │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 💬  🏠  ➕  📞  ⚙️           │
└─────────────────────────────────┘
```

## 💻 Desktop Layout (1024px+)

### Standard Desktop (1024px - 1439px)
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 FamilyLink           🔍 Search everything...         🔊 🌙      │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                     │
│ Navigation  │                Main Content                         │
│             │                                                     │
│ 💬 Messages │  ┌─────────────────┐ ┌─────────────────────────────┐ │
│ 🏠 Feed     │  │   Chat List     │ │      Chat Window            │ │
│ ➕ Create   │  │                 │ │                             │ │
│ 📞 Calls    │  │ 👨‍👩‍👧‍👦 Family   │ │ 👨‍👩‍👧‍👦 Family Group        │ │
│ ⚙️ Settings │  │ 👨‍🦲 Dad        │ │                             │ │
│             │  │ 👧 Emma       │ │ Messages and conversation   │ │
│ ────────    │  │               │ │ history displayed here      │ │
│ Text Size   │  │               │ │                             │ │
│ S M L XL    │  │               │ │                             │ │
│             │  └─────────────────┘ └─────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────┘
```

### Large Desktop (1440px+)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🏠 FamilyLink                🔍 Search everything...              🔊 🌙        │
├─────────────────┬───────────────────────────────────────────────────────────────┤
│                 │                                                             │
│   Navigation    │                    Main Content                             │
│   (380px)       │                   (Flexible)                               │
│                 │                                                             │
│ 💬 Messages     │  ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ 🏠 Feed         │  │    Chat List        │ │         Chat Window             │ │
│ ➕ Create       │  │    (420px)          │ │        (Remaining)              │ │
│ 📞 Calls        │  │                     │ │                                 │ │
│ ⚙️ Settings     │  │ 👨‍👩‍👧‍👦 Family Group │ │ 👨‍👩‍👧‍👦 Family Group           │ │
│                 │  │ 👨‍🦲 Dad            │ │ 4 members • Online              │ │
│ ─────────────   │  │ 👧 Sister Emma    │ │                                 │ │
│ Accessibility   │  │ 👵 Grandma        │ │ Rich message interface with     │ │
│                 │  │ 👨 Uncle John     │ │ media, reactions, and replies   │ │
│ Text Size       │  │                   │ │                                 │ │
│ [S] M  L  XL    │  │                   │ │                                 │ │
│                 │  └─────────────────────┘ └─────────────────────────────────┘ │
└─────────────────┴───────────────────────────────────────────────────────────────┘
```

## 🎨 Component Responsive Behavior

### Navigation Components

#### Mobile Bottom Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 16px;
  transition: all 200ms ease;
}
```

#### Desktop Sidebar Navigation
```css
.sidebar-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 8px;
  border-radius: 16px;
  transition: all 200ms ease;
}

.nav-item:hover {
  transform: scale(1.02);
  background: rgba(0, 0, 0, 0.05);
}
```

### Card Components

#### Mobile Cards
```css
.card-mobile {
  margin: 16px;
  padding: 20px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-mobile .avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
}

.card-mobile .text {
  font-size: 16px;
  line-height: 1.5;
}
```

#### Desktop Cards
```css
.card-desktop {
  margin: 24px;
  padding: 32px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
}

.card-desktop:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.card-desktop .avatar {
  width: 64px;
  height: 64px;
  border-radius: 20px;
}
```

## 🎯 Touch Target Optimization

### Mobile Touch Targets
```css
/* Minimum 44px for WCAG compliance */
.touch-target-mobile {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
  margin: 4px;
}

/* Comfortable 48px for better UX */
.touch-target-comfortable {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
  margin: 6px;
}

/* Large 56px for elderly users */
.touch-target-large {
  min-width: 56px;
  min-height: 56px;
  padding: 16px;
  margin: 8px;
}
```

### Desktop Hover States
```css
.interactive-desktop {
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 200ms ease;
  cursor: pointer;
}

.interactive-desktop:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.interactive-desktop:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## 📐 Grid Systems

### Mobile Grid (Single Column)
```css
.mobile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}
```

### Tablet Grid (Flexible)
```css
.tablet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}
```

### Desktop Grid (Fixed Sidebar)
```css
.desktop-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  height: 100vh;
}

.desktop-grid-large {
  grid-template-columns: 380px 420px 1fr;
  gap: 1px;
}
```

## 🎨 Responsive Typography

### Mobile Typography
```css
.text-mobile {
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.heading-mobile {
  font-size: 24px;
  line-height: 1.3;
  font-weight: 700;
}
```

### Desktop Typography
```css
.text-desktop {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 0.005em;
}

.heading-desktop {
  font-size: 32px;
  line-height: 1.25;
  font-weight: 700;
}
```

This responsive layout system ensures FamilyLink works beautifully across all devices while maintaining usability and accessibility for users of all ages.