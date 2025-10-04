# 🚀 Quick Start - GitHub Authentication

Get your authentication system up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies (Already Done ✅)
```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait ~2 minutes for setup

### 3. Configure GitHub OAuth

**Create GitHub OAuth App:**
- Go to: https://github.com/settings/developers
- Click "New OAuth App"
- Fill in:
  - **Homepage URL**: `http://localhost:3000`
  - **Callback URL**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Save Client ID and Secret

**Enable in Supabase:**
- Go to: Authentication > Providers > GitHub
- Enable provider
- Add Client ID and Secret
- Save

### 4. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values:
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from Supabase: **Settings > API**

### 5. Start Development Server

```bash
npm start
```

## ✨ What You Get

### Components Created:
- ✅ **AuthButton** - Sign in/out button with user avatar
- ✅ **Profile Page** - User profile with GitHub data
- ✅ **Auth Callback** - OAuth redirect handler
- ✅ **Auth Context** - Global authentication state

### Files Structure:
```
src/
├── lib/
│   └── supabase.ts                    # Supabase client config
├── contexts/
│   └── AuthContext.tsx                # Auth state management
├── components/
│   └── Auth/
│       ├── AuthButton.tsx             # Navbar auth button
│       └── AuthButton.module.css      # Button styles
├── pages/
│   ├── profile.tsx                    # User profile page
│   ├── profile.module.css             # Profile styles
│   └── auth/
│       └── callback.tsx               # OAuth callback handler
└── theme/
    ├── Root.tsx                       # App-wide AuthProvider
    └── Navbar/
        └── Content/
            ├── index.tsx              # Custom navbar with auth
            └── styles.module.css      # Navbar auth styles
```

## 🎯 Usage Examples

### Access Auth in Components

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, signInWithGitHub, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={signInWithGitHub}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {user.user_metadata.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Route Example

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

function ProtectedPage() {
  const { user, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !user) {
      history.push('/');
    }
  }, [user, loading, history]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content here</div>;
}
```

### Access User Data

```tsx
const { user } = useAuth();

// User properties:
user.id                           // Unique user ID
user.email                        // User email
user.user_metadata.name           // GitHub name
user.user_metadata.avatar_url     // GitHub avatar
user.user_metadata.user_name      // GitHub username
user.created_at                   // Account creation date
```

## 🔄 Authentication Flow

1. User clicks **"Sign in with GitHub"**
2. Redirected to GitHub OAuth page
3. User authorizes the app
4. GitHub redirects to Supabase callback
5. Supabase processes authentication
6. User redirected to `/auth/callback`
7. Callback page redirects to `/profile`
8. User is now authenticated! 🎉

## 🛠️ Customization Ideas

### Add User Database Table

Create a `profiles` table in Supabase:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
```

### Add Role-Based Access

```tsx
function AdminPage() {
  const { user } = useAuth();

  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

### Add Sign-In Modal

Instead of redirecting, show a modal:

```tsx
const [showSignIn, setShowSignIn] = useState(false);

<button onClick={() => setShowSignIn(true)}>Sign In</button>
<Modal show={showSignIn}>
  <button onClick={signInWithGitHub}>Continue with GitHub</button>
</Modal>
```

## 📝 Environment Variables for Production

When deploying, set these in your hosting platform:

**Vercel:**
```bash
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
```

**Netlify:**
Add in: Site settings > Environment variables

**GitHub Pages:**
Use GitHub Secrets and inject during build

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid client credentials" | Check GitHub OAuth app credentials in Supabase |
| "redirect_uri_mismatch" | Update callback URL in GitHub OAuth app |
| User is null | Restart dev server after changing .env |
| Styles not working | Check CSS module imports |

## 📚 Learn More

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Docusaurus Theming](https://docusaurus.io/docs/swizzling)

## 🎉 You're All Set!

Your authentication system is ready. Users can now:
- ✅ Sign in with GitHub
- ✅ View their profile
- ✅ Stay logged in across sessions
- ✅ Sign out securely

For detailed setup instructions, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
