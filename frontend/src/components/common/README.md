# Common Components

This directory contains reusable UI components for the Fantasy Sports platform.

## Components

### Header
A responsive header component with navigation, user profile, balance display, and notifications.

**Props:**
- `user: UserProfile | null` - Current user data
- `notifications: Notification[]` - Array of notifications
- `onLogout: () => void` - Logout handler

**Usage:**
```tsx
import { Header } from './components/common';

<Header
  user={user}
  notifications={notifications}
  onLogout={handleLogout}
/>
```

### Footer
A comprehensive footer with links, social media, and company information.

**Usage:**
```tsx
import { Footer } from './components/common';

<Footer />
```

### Sidebar
A responsive sidebar with navigation menu, user stats, and quick actions.

**Props:**
- `user: UserProfile | null` - Current user data
- `isOpen: boolean` - Sidebar open state
- `onClose: () => void` - Close handler

**Usage:**
```tsx
import { Sidebar } from './components/common';

<Sidebar
  user={user}
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
/>
```

### Loading
A flexible loading component with multiple variants and sizes.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Loading size
- `type?: 'spinner' | 'dots' | 'pulse'` - Loading animation type
- `text?: string` - Loading text
- `fullScreen?: boolean` - Full screen overlay

**Usage:**
```tsx
import { Loading, PageLoading, ButtonLoading, CardLoading, TableLoading } from './components/common';

// Basic loading
<Loading size="md" type="spinner" text="Loading..." />

// Page loading overlay
<PageLoading />

// Button loading state
<ButtonLoading text="Saving..." />

// Card skeleton loading
<CardLoading />

// Table skeleton loading
<TableLoading />
```

### ErrorBoundary
A React error boundary component to catch and handle errors gracefully.

**Props:**
- `children: ReactNode` - Child components
- `fallback?: ReactNode` - Custom fallback UI

**Usage:**
```tsx
import { ErrorBoundary, withErrorBoundary } from './components/common';

// Wrap components
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Higher-order component
const SafeComponent = withErrorBoundary(YourComponent);
```

### Modal
A flexible modal component with different types and sizes.

**Props:**
- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close handler
- `title?: string` - Modal title
- `children: ReactNode` - Modal content
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size
- `type?: 'default' | 'confirm' | 'alert' | 'form'` - Modal type
- `showCloseButton?: boolean` - Show close button
- `closeOnOverlayClick?: boolean` - Close on overlay click
- `closeOnEscape?: boolean` - Close on escape key

**Usage:**
```tsx
import { Modal, ConfirmModal, AlertModal } from './components/common';

// Basic modal
<Modal isOpen={isOpen} onClose={onClose} title="My Modal">
  <p>Modal content here</p>
</Modal>

// Confirmation modal
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  cancelText="Cancel"
  confirmVariant="danger"
/>

// Alert modal
<AlertModal
  isOpen={isOpen}
  onClose={onClose}
  title="Success"
  message="Operation completed successfully!"
  type="success"
  buttonText="OK"
/>
```

## Types

### UserProfile
```typescript
interface UserProfile {
  id: string;
  username: string;
  email?: string;
  balance: number;
  totalWinnings?: number;
  contestsPlayed?: number;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}
```

## Styling

All components use Tailwind CSS for styling and are fully responsive. The design follows a consistent color scheme:

- Primary: Blue (`blue-600`, `blue-700`, `blue-800`)
- Secondary: Yellow (`yellow-400`, `yellow-500`)
- Success: Green (`green-500`, `green-600`)
- Danger: Red (`red-500`, `red-600`)
- Warning: Orange (`orange-500`, `orange-600`)
- Neutral: Gray (`gray-50`, `gray-100`, `gray-200`, etc.)

## Accessibility

Components include proper accessibility features:
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Responsive Design

All components are mobile-first and responsive:
- Mobile: Single column layouts
- Tablet: Adaptive layouts
- Desktop: Full feature layouts

## Usage Examples

See the main `App.tsx` file for a complete example of how to integrate these components into your application. 