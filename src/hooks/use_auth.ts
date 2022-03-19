import supabase from '../lib/client';

export const useAuth = () => supabase.auth.user();
