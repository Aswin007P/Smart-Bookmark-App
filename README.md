# Smart Bookmark App

A real-time bookmark manager with Google OAuth and Supabase.

## Live Demo
[Your Vercel URL Here]

## Key Features
- Google OAuth authentication (no password)
- Real-time sync across multiple tabs
- User-specific bookmark isolation
- One-click bookmark deletion
- Responsive Tailwind UI

## Technical Stack
- Next.js 14 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel Deployment

## Critical Solutions to Common Problems

### 1. Realtime Sync Failure
**Problem:** Bookmarks not updating across tabs  
**Solution:**  
- Implemented proper Supabase realtime subscription with user-specific filter (`user_id=eq.${userId}`)
- Fixed to use `payload.event_type` (not `payload.eventType`) as per Supabase API
- Used state updates instead of `router.refresh()` for real-time experience

### 2. Auth Session Loss
**Problem:** User gets logged out when switching tabs  
**Solution:**  
- Added proper cleanup for `onAuthStateChange` listeners
- Implemented cookie-based session storage for server-side validation
- Used route groups for proper auth flow

### 3. RLS Policy Errors
**Problem:** "401: Not authorized" errors  
**Solution:**  
- Created explicit RLS policy with `WITH CHECK` clause
- Verified table permissions in Supabase Dashboard
- Ensured `user_id` matches `auth.users.id` format

### 4. Vercel Deployment Issues
**Problem:** Callback URL errors in production  
**Solution:**  
- Added production callback URL to Supabase allowed URLs
- Used `NEXT_PUBLIC_SITE_URL` for dynamic redirects
- Verified environment variables in Vercel dashboard

## Getting Started
1. Create Supabase project and configure Google Auth
2. Run `npm install`
3. Add `.env.local` with your Supabase keys
4. `npm run dev`