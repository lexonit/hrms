# Authentication Middleware Documentation

## Overview
The application uses Next.js middleware to protect routes and enforce authentication/authorization at the edge, before any page rendering occurs.

## Files Modified/Created

### 1. `middleware.ts` (NEW)
Location: `ui/middleware.ts`

**Purpose:** Edge middleware that runs on every request to protect routes and enforce authentication.

**Features:**
- ✅ Public/Private route separation
- ✅ Automatic redirect for unauthenticated users
- ✅ Automatic redirect for authenticated users on login page
- ✅ Role-based access control (RBAC)
- ✅ Security headers injection
- ✅ Redirect URL preservation
- ✅ Cookie-based authentication state

**Route Configuration:**
```typescript
// Public Routes (no authentication required)
const publicRoutes = ['/'];

// Private Routes (authentication required)
const privateRoutes = [
  '/dashboard',
  '/employees',
  '/projects',
  '/tasks',
  '/attendance',
  '/leaves',
  '/timesheets',
  '/kb',
  '/settings',
];

// Role-Based Restrictions
const roleRestrictedRoutes = {
  '/employees': ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  '/settings': ['SUPER_ADMIN', 'HR_ADMIN'],
};
```

**Security Headers Added:**
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Disables camera, microphone, geolocation

### 2. `lib/store/index.ts` (MODIFIED)
**Changes:**
- Added `persist` middleware from Zustand
- Implemented dual storage (localStorage + Cookie)
- Cookie synchronization for middleware access
- Partialize to only persist authentication state

**Storage Strategy:**
```typescript
storage: createJSONStorage(() => ({
  getItem: (name) => {
    // Read from localStorage
    const value = localStorage.getItem(name);
    // Sync to cookie for middleware
    if (value) {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
    }
    return value;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    // Sync to cookie for middleware
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    // Remove cookie
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
}))
```

### 3. `components/layouts/authenticated-layout.tsx` (MODIFIED)
**Changes:**
- Removed client-side authentication redirect
- Middleware now handles all authentication checks
- Simplified component logic

### 4. `app/page.tsx` (MODIFIED)
**Changes:**
- Added support for `redirect` query parameter
- Preserves intended destination after login
- Cleaner redirect logic

### 5. `app/settings/page.tsx` (NEW)
**Purpose:** Settings page for admin users

**Access Control:**
- Only accessible to SUPER_ADMIN and HR_ADMIN roles
- Middleware enforces role restriction
- Automatically redirects unauthorized users to dashboard

## Flow Diagrams

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Requests Page                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Middleware Intercepts Request                   │
│  - Checks auth-storage cookie                                │
│  - Parses user authentication state                          │
│  - Validates user role                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
           ┌──────────┴──────────┐
           │                     │
      Authenticated?          Not Authenticated?
           │                     │
           ▼                     ▼
    ┌──────────────┐      ┌──────────────┐
    │ Private Page │      │ Public Page  │
    └──────┬───────┘      └──────┬───────┘
           │                     │
           ▼                     ▼
    Check Role Access      Redirect to /
           │              with ?redirect param
           ▼
    ┌──────────────┐
    │  Authorized? │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    Yes         No
     │           │
     ▼           ▼
  Allow    Redirect to
  Access    /dashboard
```

### Login Flow with Redirect

```
1. User tries to access /projects (not authenticated)
   ↓
2. Middleware redirects to /?redirect=/projects
   ↓
3. User logs in on home page
   ↓
4. Login sets cookie via Zustand persist
   ↓
5. Client-side redirect to /projects (from redirect param)
   ↓
6. Middleware validates cookie
   ↓
7. User accesses /projects
```

## Usage Examples

### Scenario 1: User Tries to Access Dashboard Without Login
```
1. Navigate to: /dashboard
2. Middleware detects: No auth-storage cookie
3. Redirect to: /?redirect=/dashboard
4. User sees: Login page
5. After login: Redirected to /dashboard
```

### Scenario 2: Authenticated User Visits Login Page
```
1. Navigate to: /
2. Middleware detects: Valid auth-storage cookie
3. Redirect to: /dashboard
4. User sees: Dashboard page
```

### Scenario 3: Developer Tries to Access Settings
```
1. Navigate to: /settings
2. Middleware detects: User role is DEVELOPER
3. Role check: DEVELOPER not in ['SUPER_ADMIN', 'HR_ADMIN']
4. Redirect to: /dashboard
5. User sees: Dashboard page (access denied)
```

### Scenario 4: Admin Accesses Settings
```
1. Navigate to: /settings
2. Middleware detects: User role is SUPER_ADMIN
3. Role check: SUPER_ADMIN in allowed roles
4. Allow access
5. User sees: Settings page
```

## Adding New Protected Routes

### 1. Add to Private Routes Array
```typescript
// In middleware.ts
const privateRoutes = [
  '/dashboard',
  '/employees',
  '/your-new-route', // Add here
];
```

### 2. (Optional) Add Role Restrictions
```typescript
// In middleware.ts
const roleRestrictedRoutes = {
  '/your-new-route': ['SUPER_ADMIN'], // Only admins
};
```

### 3. Create Page Component
```typescript
// app/your-new-route/page.tsx
'use client';

import AuthenticatedLayout from '@/components/layouts/authenticated-layout';

export default function YourPage() {
  return (
    <AuthenticatedLayout>
      {/* Your content */}
    </AuthenticatedLayout>
  );
}
```

### 4. Add to Sidebar Navigation
```typescript
// components/navigation/sidebar.tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    icon: YourIcon,
    label: 'Your Label',
    id: 'your-new-route',
    roles: [UserRole.SUPER_ADMIN], // Optional role filter
  },
];
```

## Security Considerations

### Cookie Security
- **SameSite=Lax**: Prevents CSRF attacks
- **Max-Age=604800**: 7 days expiration
- **Path=/**: Available to all routes
- **HttpOnly**: Not set (needed for client-side access via Zustand)

### Best Practices
✅ Authentication state synced between localStorage and cookie
✅ Middleware runs at edge (before page rendering)
✅ Role-based access control enforced server-side
✅ Security headers prevent common attacks
✅ Redirect URLs preserved for better UX

### Limitations
⚠️ Cookie is not HttpOnly (required for Zustand access)
⚠️ Authentication is client-side only (no backend validation)
⚠️ Suitable for demo/development, not production without backend

## Testing Checklist

### Authentication Tests
- [ ] Unauthenticated user cannot access /dashboard
- [ ] Authenticated user redirected from / to /dashboard
- [ ] Login preserves redirect parameter
- [ ] Logout clears cookie and localStorage

### Authorization Tests
- [ ] Developer cannot access /settings
- [ ] Admin can access /settings
- [ ] Developer cannot access /employees
- [ ] Manager can access /employees

### Security Tests
- [ ] Security headers present in response
- [ ] Cookie set with correct attributes
- [ ] Cookie removed on logout
- [ ] Invalid cookie format handled gracefully

### UX Tests
- [ ] Smooth redirect on protected route access
- [ ] No flash of wrong content
- [ ] Back button works correctly
- [ ] URL state preserved

## Troubleshooting

### Issue: Infinite Redirect Loop
**Cause:** Cookie not being set properly
**Solution:** Check browser DevTools > Application > Cookies

### Issue: User Redirected Even When Logged In
**Cause:** Cookie might be expired or invalid
**Solution:** Clear cookies and localStorage, login again

### Issue: Role Restrictions Not Working
**Cause:** Role check case sensitivity
**Solution:** Ensure roles match exactly (e.g., 'SUPER_ADMIN' not 'Super_Admin')

### Issue: Middleware Not Running
**Cause:** Path not matching middleware config
**Solution:** Check `config.matcher` in middleware.ts

## Performance

- **Edge Execution:** Middleware runs at CDN edge (fast)
- **No Server Round-Trip:** Authentication check before rendering
- **Cookie Size:** ~500 bytes (minimal)
- **localStorage Sync:** Instant (client-side only)

## Future Enhancements

1. **Backend Integration:**
   - JWT tokens instead of cookie state
   - Server-side session validation
   - Token refresh mechanism

2. **Enhanced Security:**
   - HttpOnly cookies with separate auth service
   - CSRF token validation
   - Rate limiting on login attempts

3. **Advanced RBAC:**
   - Permission-based access (not just roles)
   - Dynamic role assignment
   - Resource-level permissions

4. **Audit Logging:**
   - Track all authentication events
   - Log unauthorized access attempts
   - User activity monitoring

---

**Version:** 1.0.0  
**Last Updated:** February 1, 2026  
**Maintained By:** Development Team
