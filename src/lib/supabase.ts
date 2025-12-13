// Supabase client for the app.
// Uses Vite env vars VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
// If env vars are not set, exports a safe no-op fallback that returns
// empty results so the app can run in dev without secrets.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env as Record<string, any>;
const SUPABASE_URL = env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseClientInstance: SupabaseClient | null = null;

// Check if the values are actual URLs/keys, not placeholders
const isValidUrl = SUPABASE_URL && SUPABASE_URL.startsWith('http') && !SUPABASE_URL.includes('your_');
const isValidKey = SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 50 && !SUPABASE_ANON_KEY.includes('your_');

if (isValidUrl && isValidKey) {
  supabaseClientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   
  console.info('[supabase] client initialized');
} else {
  // Only warn in development; in production we keep it informational.
   
  if (import.meta.env.DEV) {
    console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — using noop client');
  } else {
    console.info('[supabase] no env vars set; using noop client');
  }
}

// No-op fallback that mimics the `.from(...).select().order().limit()` chain used in the app.
const noopChain = () => {
  const chain: any = {
    select() {
      return chain;
    },
    order() {
      return chain;
    },
    insert() {
      return chain;
    },
    limit: async (_n?: number) => ({ 
      data: [], 
      error: { 
        message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      } 
    }),
  };
  return chain;
};

export const getSupabase = (): SupabaseClient | { from: (table: string) => any } => {
  return supabaseClientInstance ?? { from: (_table: string) => noopChain() };
};

// Named export `supabase` for compatibility with existing imports in the codebase.
export const supabase = getSupabase();

// Keep a `supabaseClient` (real client instance) for advanced usage and default export.
export const supabaseClient = (supabaseClientInstance ?? ({} as any)) as SupabaseClient | any;
export default supabase;
