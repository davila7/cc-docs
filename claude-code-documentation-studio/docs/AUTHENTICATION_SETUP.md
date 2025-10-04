# 🔐 Authentication Setup Guide

This guide will help you set up GitHub OAuth authentication using Supabase for your Docusaurus site.

## Prerequisites

- A GitHub account
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: Choose a name for your project
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"** and wait for it to initialize (~2 minutes)

## Step 2: Configure GitHub OAuth in Supabase

### 2.1 Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `Your Site Name - Auth`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
     - You can find this in your Supabase project settings under **Settings > API > Project URL**
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it

### 2.2 Configure GitHub Provider in Supabase

1. In your Supabase project, go to **Authentication > Providers**
2. Find **GitHub** in the list and click to expand
3. Toggle **"Enable GitHub provider"** to ON
4. Paste your GitHub **Client ID** and **Client Secret**
5. Click **"Save"**

## Step 3: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings > API**
2. Copy the following values:
   - **Project URL**: Your Supabase URL
   - **anon public** key: Your public anonymous key

## Step 4: Configure Environment Variables

1. Create a `.env` file in the `docs` directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Important**: Make sure `.env` is in your `.gitignore` to keep your keys secret!

## Step 5: Update GitHub OAuth App for Production

When you deploy to production, you'll need to:

1. Go back to your GitHub OAuth App settings
2. Update the **Homepage URL** to your production URL (e.g., `https://yourdomain.com`)
3. Update or add a new **Authorization callback URL**:
   - Keep the Supabase callback: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`

## Step 6: Test the Authentication

1. Start your development server:
   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

3. Click the **"Sign in with GitHub"** button in the navbar

4. You should be redirected to GitHub to authorize the app

5. After authorization, you'll be redirected back to your profile page

## Troubleshooting

### "Invalid client credentials" error
- Double-check that your GitHub Client ID and Client Secret are correct in Supabase
- Make sure the GitHub OAuth App callback URL matches your Supabase project URL

### "redirect_uri_mismatch" error
- Verify that your GitHub OAuth App's callback URL is exactly: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
- Make sure there are no trailing slashes

### User is null after authentication
- Check your browser console for errors
- Verify that your Supabase URL and anon key are correct in your `.env` file
- Make sure you restarted your dev server after changing `.env`

### Authentication works locally but not in production
- Update your GitHub OAuth App URLs for production
- Make sure environment variables are set in your deployment platform
- Check that your production URL matches the callback URL

## Features Included

✅ GitHub OAuth authentication
✅ User profile page with GitHub data
✅ Persistent sessions
✅ Automatic token refresh
✅ Sign out functionality
✅ Protected routes
✅ User avatar and metadata display

## Security Best Practices

1. ✅ Never commit `.env` files to version control
2. ✅ Use environment variables for all sensitive data
3. ✅ Keep your Supabase anon key public-safe (it's designed to be public)
4. ✅ Never expose your Supabase service role key in client code
5. ✅ Enable Row Level Security (RLS) in Supabase for database tables
6. ✅ Use HTTPS in production

## Next Steps

- Customize the profile page with additional user information
- Add role-based access control
- Implement protected documentation pages
- Add user preferences and settings
- Create a user database table in Supabase to store additional data

## Support

For issues with:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **GitHub OAuth**: Check [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- **This implementation**: Open an issue in the repository

---

**Note**: This setup uses Supabase's built-in authentication system, which handles all the OAuth flow, token management, and security for you. The anon key is safe to use in public client code.
