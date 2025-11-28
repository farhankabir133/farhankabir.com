# Newsletter Subscription Setup

## Prerequisites

You need a Supabase account and project. If you don't have one:
1. Go to https://supabase.com
2. Sign up and create a new project
3. Wait for the project to be provisioned (takes ~2 minutes)

## Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to your Supabase Dashboard: https://app.supabase.com
   - Select your project
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

3. Update `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. Restart your dev server after updating `.env`:
   ```bash
   npm run dev
   ```

## Step 2: Apply the Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase/migrations/20251127000000_newsletter_subscribers.sql`
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned"

### Option B: Using Supabase CLI (if installed)

```bash
supabase db push
```

### What the Migration Does

Creates a `newsletter_subscribers` table with:
- `id` (uuid, primary key)
- `email` (text, unique, required)
- `status` (text, default 'active')
- `source` (text, default 'website')
- `subscribed_at` (timestamp)
- `unsubscribed_at` (timestamp, optional)

### Features

✅ **Direct Email Collection**: Emails are saved directly to your Supabase database
✅ **Duplicate Prevention**: Unique constraint on email prevents duplicates
✅ **User Feedback**: Shows success or "already subscribed" messages
✅ **Source Tracking**: Tracks where subscriptions came from (hero_section)
✅ **Status Management**: Supports active/unsubscribed statuses for future unsubscribe feature

### Viewing Your Subscribers

You can view all newsletter subscribers in your Supabase dashboard:
1. Go to Table Editor
2. Select `newsletter_subscribers` table
3. View all subscribed emails

Or query via SQL:
```sql
SELECT email, subscribed_at, source 
FROM newsletter_subscribers 
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

### Environment Variables

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
