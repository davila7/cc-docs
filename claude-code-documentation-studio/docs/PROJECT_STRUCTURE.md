# 🗂️ Project Structure

## Complete File Tree

```
claude-code-documentation-studio/docs/
│
├── 📄 Configuration Files
│   ├── .env.example                      # Environment variables template
│   ├── .gitignore                        # Git ignore rules (includes .env)
│   ├── package.json                      # Dependencies & scripts
│   ├── docusaurus.config.ts              # Docusaurus configuration
│   ├── sidebars.ts                       # Documentation sidebar
│   └── tsconfig.json                     # TypeScript configuration
│
├── 📚 Documentation
│   ├── README.md                         # Main readme with auth info
│   ├── AUTHENTICATION_SETUP.md           # Detailed setup guide
│   ├── AUTHENTICATION_QUICKSTART.md      # 5-minute quick start
│   ├── ARCHITECTURE.md                   # Technical architecture
│   ├── EXAMPLES.md                       # Code examples
│   └── AUTH_SUMMARY.md                   # Complete summary
│
├── 📂 src/
│   │
│   ├── 🔧 lib/
│   │   └── supabase.ts                   # Supabase client configuration
│   │
│   ├── 🎯 contexts/
│   │   └── AuthContext.tsx               # Global auth state management
│   │
│   ├── 🧩 components/
│   │   ├── Auth/
│   │   │   ├── AuthButton.tsx            # Sign in/out button
│   │   │   └── AuthButton.module.css     # Button styles
│   │   └── HomepageFeatures/
│   │       └── ...                       # Homepage components
│   │
│   ├── 📄 pages/
│   │   ├── index.tsx                     # Homepage
│   │   ├── profile.tsx                   # User profile page
│   │   ├── profile.module.css            # Profile styles
│   │   └── auth/
│   │       └── callback.tsx              # OAuth callback handler
│   │
│   ├── 🎨 theme/
│   │   ├── Root.tsx                      # App-wide AuthProvider wrapper
│   │   └── Navbar/
│   │       └── Content/
│   │           ├── index.tsx             # Custom navbar with auth
│   │           └── styles.module.css     # Navbar auth styles
│   │
│   └── 🎨 css/
│       └── custom.css                    # Custom global styles
│
├── 📂 docs/
│   ├── intro.md
│   ├── subagents/
│   │   └── ...
│   ├── hooks/
│   │   └── ...
│   └── workflows/
│       └── ...
│
├── 📂 blog/
│   └── ...
│
├── 📂 static/
│   ├── img/
│   └── ...
│
└── 📂 build/                             # Generated on build
    └── ...
```

## Key Files Explained

### Authentication Core

#### `src/lib/supabase.ts`
```typescript
Purpose: Initialize Supabase client
Size: ~15 lines
Dependencies: @supabase/supabase-js
```

#### `src/contexts/AuthContext.tsx`
```typescript
Purpose: Manage global auth state
Size: ~80 lines
Exports: AuthProvider, useAuth
Features:
  - User state management
  - Session handling
  - Sign in/out methods
  - Auth state listeners
```

#### `src/theme/Root.tsx`
```typescript
Purpose: Wrap entire app with AuthProvider
Size: ~10 lines
Makes auth available globally
```

### UI Components

#### `src/components/Auth/AuthButton.tsx`
```typescript
Purpose: Navbar authentication UI
Size: ~60 lines
States:
  - Loading
  - Logged in (avatar + username + sign out)
  - Logged out (sign in button)
Responsive: Yes
```

#### `src/pages/profile.tsx`
```typescript
Purpose: User profile page
Size: ~120 lines
Features:
  - Protected route
  - GitHub data display
  - Profile card layout
  - Responsive design
Protected: Yes (redirects if not logged in)
```

#### `src/pages/auth/callback.tsx`
```typescript
Purpose: Handle OAuth redirect
Size: ~40 lines
Process:
  1. Receive OAuth callback
  2. Validate session
  3. Redirect to profile or home
```

### Theme Customization

#### `src/theme/Navbar/Content/index.tsx`
```typescript
Purpose: Custom navbar with auth button
Size: ~15 lines
Method: Swizzled Docusaurus component
Maintains: Original navbar functionality
Adds: AuthButton component
```

## Component Relationships

```
Root (AuthProvider)
│
├── Navbar
│   └── NavbarContent
│       ├── Original Navbar Items
│       └── AuthButton
│           ├── [Not Logged In] Sign In Button
│           └── [Logged In]
│               ├── Avatar
│               ├── Username Link → /profile
│               └── Sign Out Button
│
└── Routes
    ├── / (Homepage)
    ├── /profile (Protected)
    │   ├── Profile Header
    │   │   ├── Avatar
    │   │   ├── Name
    │   │   └── Username
    │   └── Profile Info
    │       ├── Account Information
    │       └── Bio (if available)
    └── /auth/callback
        └── Loading → Redirect
```

## Data Flow

```
User Action
    ↓
Component (useAuth hook)
    ↓
AuthContext
    ↓
Supabase Client
    ↓
Supabase Backend
    ↓
GitHub OAuth
    ↓
Response
    ↓
Update AuthContext State
    ↓
Re-render Components
```

## File Size Breakdown

| Category | Files | Total Lines |
|----------|-------|-------------|
| Configuration | 6 | ~200 |
| Authentication | 3 | ~120 |
| Components | 3 | ~150 |
| Pages | 3 | ~200 |
| Styles | 3 | ~200 |
| Documentation | 6 | ~1,500 |
| **Total** | **24** | **~2,370** |

## Import Map

```typescript
// Most common imports

// Auth
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Docusaurus
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';

// Types
import type { User, Session } from '@supabase/supabase-js';
```

## Environment Variables

```
Required (.env):
├── REACT_APP_SUPABASE_URL
└── REACT_APP_SUPABASE_ANON_KEY

Template (.env.example):
└── Same as above with placeholder values
```

## Build Output

```
build/
├── index.html                    # Homepage with auth
├── profile/
│   └── index.html               # Protected profile page
├── auth/
│   └── callback/
│       └── index.html           # OAuth callback
└── assets/
    ├── css/
    ├── js/
    └── images/
```

## Dependencies Added

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.58.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/auth-ui-shared": "^0.1.8"
  }
}
```

## Scripts Available

```bash
npm start          # Development server
npm run build      # Production build
npm run serve      # Serve production build
npm run clear      # Clear cache
npm run deploy     # Deploy to hosting
```

## TypeScript Configuration

- Strict mode: Enabled
- JSX: React
- Module: ESNext
- Target: ES2020

## CSS Architecture

```
Styling Strategy:
├── CSS Modules (component-specific)
│   ├── AuthButton.module.css
│   ├── profile.module.css
│   └── styles.module.css
├── Custom CSS (global)
│   └── src/css/custom.css
└── Docusaurus Theme (inherited)
    └── Infima CSS framework
```

## Security Files

```
.gitignore includes:
├── .env
├── .env.local
├── node_modules/
└── build/
```

## Development vs Production

### Development
- Uses `http://localhost:3000`
- Environment: `.env` file
- Hot reload: Enabled
- Source maps: Yes

### Production
- Uses production domain
- Environment: Platform env vars
- Optimized build: Yes
- Minified: Yes
- Source maps: No

## Quick Navigation

| Want to... | Check file... |
|------------|---------------|
| Understand auth flow | `ARCHITECTURE.md` |
| Set up auth | `AUTHENTICATION_SETUP.md` |
| Quick start | `AUTHENTICATION_QUICKSTART.md` |
| See code examples | `EXAMPLES.md` |
| Get overview | `AUTH_SUMMARY.md` |
| Modify auth logic | `src/contexts/AuthContext.tsx` |
| Change UI | `src/components/Auth/AuthButton.tsx` |
| Edit profile page | `src/pages/profile.tsx` |
| Configure Supabase | `src/lib/supabase.ts` |

---

**Note**: All paths are relative to the `docs/` directory in the project.
