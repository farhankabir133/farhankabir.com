# Newsletter Subscription Troubleshooting

## Error: "Something went wrong"

This error typically occurs due to one of the following issues:

### 1. **Supabase Not Configured** ✅ MOST COMMON

**Symptoms:**
- Console shows: `[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set`
- Newsletter button shows "Something went wrong"

**Solution:**
1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **Important:** Restart your dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### 2. **Database Table Not Created**

**Symptoms:**
- Error message: "Database table not found"
- Console shows: "relation does not exist"

**Solution:**
Run the SQL migration in Supabase:
1. Go to https://app.supabase.com
2. Open SQL Editor
3. Run the SQL from `supabase/migrations/20251127000000_newsletter_subscribers.sql`

### 3. **Network/CORS Issues**

**Symptoms:**
- Console shows CORS errors
- Network tab shows failed requests

**Solution:**
Check Supabase project settings:
1. Go to Authentication → URL Configuration
2. Add your local dev URL: `http://localhost:5173` (or your port)

### 4. **RLS Policies Not Set**

**Symptoms:**
- Error: "new row violates row-level security policy"

**Solution:**
The migration includes RLS policies, but verify:
1. Go to Table Editor → newsletter_subscribers
2. Check Policies tab
3. Ensure "Allow public insert" policy exists

## Debugging Steps

### Step 1: Check Browser Console
Open DevTools (F12) and look for:
- `[supabase]` log messages
- `Newsletter subscription error:` messages
- Any red error messages

### Step 2: Verify Environment Variables
Add this temporarily to `Hero.tsx` to debug:
```typescript
console.log('Supabase configured:', !!supabase && typeof supabase.from === 'function');
```

### Step 3: Test Supabase Connection
Try this in browser console:
```javascript
// Check if supabase is loaded
console.log(window);
```

### Step 4: Manual Database Test
In Supabase SQL Editor, try:
```sql
INSERT INTO newsletter_subscribers (email, source, status)
VALUES ('test@example.com', 'manual_test', 'active');

SELECT * FROM newsletter_subscribers;
```

## Quick Checklist

- [ ] `.env` file exists in project root
- [ ] `.env` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server was restarted after adding `.env`
- [ ] Database migration was run in Supabase
- [ ] Table `newsletter_subscribers` exists in Supabase
- [ ] Browser console shows `[supabase] client initialized`

## Still Not Working?

1. Share the **exact error message** from browser console
2. Check if `newsletter_subscribers` table exists in Supabase Table Editor
3. Verify your Supabase project is active (not paused)
4. Try the manual database test above
