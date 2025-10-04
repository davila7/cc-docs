# 💡 Code Examples

Practical examples for extending and using the authentication system.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Protected Routes](#protected-routes)
- [Custom Hooks](#custom-hooks)
- [Role-Based Access](#role-based-access)
- [User Database Integration](#user-database-integration)
- [Advanced Patterns](#advanced-patterns)

## Basic Usage

### Check if User is Logged In

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <p>Welcome, {user.user_metadata.name}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Sign In/Out Buttons

```tsx
import { useAuth } from '../contexts/AuthContext';

function AuthButtons() {
  const { user, signInWithGitHub, signOut } = useAuth();

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signInWithGitHub}>Sign In with GitHub</button>
      )}
    </div>
  );
}
```

### Display User Info

```tsx
import { useAuth } from '../contexts/AuthContext';

function UserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  const { name, avatar_url, user_name, bio } = user.user_metadata;

  return (
    <div className="user-info">
      <img src={avatar_url} alt={name} />
      <h2>{name}</h2>
      <p>@{user_name}</p>
      <p>{bio}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Protected Routes

### Simple Protected Page

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !user) {
      history.push('/');
    }
  }, [user, loading, history]);

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout title="Protected Page">
      <div>
        <h1>This is a protected page</h1>
        <p>Only logged-in users can see this.</p>
      </div>
    </Layout>
  );
}
```

### Protected Route with Redirect Message

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';

export default function ProtectedPageWithMessage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowMessage(true);
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && showMessage) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>You need to sign in to access this page.</p>
        <button onClick={signInWithGitHub}>
          Sign In with GitHub
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.user_metadata.name}!</p>
    </div>
  );
}
```

## Custom Hooks

### useRequireAuth Hook

```tsx
// hooks/useRequireAuth.ts
import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '../contexts/AuthContext';

export function useRequireAuth(redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!loading && !user) {
      history.push(redirectTo);
    }
  }, [user, loading, history, redirectTo]);

  return { user, loading };
}

// Usage in component:
function ProtectedPage() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

### useUserMetadata Hook

```tsx
// hooks/useUserMetadata.ts
import { useAuth } from '../contexts/AuthContext';

export function useUserMetadata() {
  const { user } = useAuth();

  return {
    name: user?.user_metadata?.name || '',
    username: user?.user_metadata?.user_name || '',
    avatar: user?.user_metadata?.avatar_url || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    isAuthenticated: !!user,
  };
}

// Usage:
function UserCard() {
  const { name, username, avatar, isAuthenticated } = useUserMetadata();

  if (!isAuthenticated) return null;

  return (
    <div>
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>@{username}</p>
    </div>
  );
}
```

## Role-Based Access

### Define Roles

```tsx
// types/roles.ts
export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
}

export interface UserWithRole extends User {
  user_metadata: {
    role?: UserRole;
    [key: string]: any;
  };
}
```

### Check User Role Hook

```tsx
// hooks/useUserRole.ts
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/roles';

export function useUserRole() {
  const { user } = useAuth();

  const role = (user?.user_metadata?.role as UserRole) || UserRole.User;

  const isAdmin = role === UserRole.Admin;
  const isModerator = role === UserRole.Moderator || isAdmin;
  const isUser = !!user;

  const hasRole = (requiredRole: UserRole) => {
    if (requiredRole === UserRole.User) return isUser;
    if (requiredRole === UserRole.Moderator) return isModerator;
    if (requiredRole === UserRole.Admin) return isAdmin;
    return false;
  };

  return {
    role,
    isAdmin,
    isModerator,
    isUser,
    hasRole,
  };
}
```

### Role-Based Component

```tsx
import { useUserRole } from '../hooks/useUserRole';
import { UserRole } from '../types/roles';

function AdminPanel() {
  const { hasRole } = useUserRole();

  if (!hasRole(UserRole.Admin)) {
    return <div>Access Denied: Admin only</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Administrative content here</p>
    </div>
  );
}
```

### Conditional Rendering by Role

```tsx
function Dashboard() {
  const { isAdmin, isModerator } = useUserRole();

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Everyone sees this */}
      <section>
        <h2>My Content</h2>
      </section>

      {/* Moderators and Admins */}
      {isModerator && (
        <section>
          <h2>Moderation Tools</h2>
        </section>
      )}

      {/* Admins only */}
      {isAdmin && (
        <section>
          <h2>Admin Settings</h2>
        </section>
      )}
    </div>
  );
}
```

## User Database Integration

### Create Profile on Sign Up

```tsx
// contexts/AuthContext.tsx
useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);

    // Create profile on first sign in
    if (event === 'SIGNED_IN' && session) {
      await createOrUpdateProfile(session.user);
    }
  });

  return () => subscription.unsubscribe();
}, []);

async function createOrUpdateProfile(user: User) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      username: user.user_metadata.user_name,
      avatar_url: user.user_metadata.avatar_url,
      full_name: user.user_metadata.name,
      email: user.email,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error creating profile:', error);
  }
}
```

### Fetch User Profile

```tsx
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  full_name: string;
  bio: string;
  website: string;
  created_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  return { profile, loading };
}
```

### Update User Profile

```tsx
// hooks/useUpdateProfile.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useUpdateProfile() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    setUpdating(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      setError(updateError.message);
    }

    setUpdating(false);
    return !updateError;
  };

  return { updateProfile, updating, error };
}

// Usage:
function EditProfile() {
  const { user } = useAuth();
  const { updateProfile, updating } = useUpdateProfile();
  const [bio, setBio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(user.id, { bio });
    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
      />
      <button type="submit" disabled={updating}>
        {updating ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
```

## Advanced Patterns

### Auth Loading Wrapper

```tsx
// components/AuthLoadingWrapper.tsx
import { useAuth } from '../contexts/AuthContext';

export function AuthLoadingWrapper({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage in layout:
function Layout({ children }) {
  return (
    <AuthLoadingWrapper>
      {children}
    </AuthLoadingWrapper>
  );
}
```

### Conditional Navigation Items

```tsx
// In docusaurus.config.ts navbar items
// Use a custom component for dynamic items

// src/theme/NavbarItem/index.tsx
import { useAuth } from '../../contexts/AuthContext';

export default function CustomNavbarItem(props) {
  const { user } = useAuth();

  // Only show certain items when logged in
  if (props.authRequired && !user) {
    return null;
  }

  // Show different items based on role
  if (props.adminOnly && user?.user_metadata?.role !== 'admin') {
    return null;
  }

  return <OriginalNavbarItem {...props} />;
}
```

### Modal Sign In

```tsx
// components/SignInModal.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function SignInModal({ isOpen, onClose }) {
  const { signInWithGitHub } = useAuth();

  const handleSignIn = async () => {
    await signInWithGitHub();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign In</h2>
        <p>Sign in to access premium features</p>
        <button onClick={handleSignIn}>
          Continue with GitHub
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// Usage:
function FeatureButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!user) {
      setShowModal(true);
    } else {
      // Do the feature
    }
  };

  return (
    <>
      <button onClick={handleClick}>Premium Feature</button>
      <SignInModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
```

### User Preferences

```tsx
// hooks/useUserPreferences.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    notifications: true,
    language: 'en',
  });

  useEffect(() => {
    if (user) {
      // Load preferences from localStorage or database
      const stored = localStorage.getItem(`prefs_${user.id}`);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    }
  }, [user]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);

    if (user) {
      localStorage.setItem(`prefs_${user.id}`, JSON.stringify(newPrefs));
    }
  };

  return { preferences, updatePreferences };
}
```

### Analytics Integration

```tsx
// utils/analytics.ts
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useTrackUser() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Track user in analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          user_id: user.id,
        });
      }

      // Or use other analytics
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.identify(user.id, {
          email: user.email,
          name: user.user_metadata.name,
        });
      }
    }
  }, [user]);
}

// Usage in Root.tsx:
export default function Root({ children }) {
  useTrackUser();
  return <AuthProvider>{children}</AuthProvider>;
}
```

## SQL Schemas

### Profiles Table

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
```

### User Roles Table

```sql
create table user_roles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'user',
  granted_at timestamp with time zone default timezone('utc'::text, now()),
  granted_by uuid references auth.users
);

alter table user_roles enable row level security;

create policy "Anyone can view roles"
  on user_roles for select
  using ( true );

create policy "Only admins can manage roles"
  on user_roles for all
  using ( auth.uid() in (
    select id from user_roles where role = 'admin'
  ));
```

---

These examples should cover most common use cases. Mix and match them to build your perfect authentication flow! 🚀
