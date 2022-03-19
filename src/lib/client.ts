import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY as string;

export default createClient(supabaseUrl, supabaseApiKey, {
  autoRefreshToken: true,
});
