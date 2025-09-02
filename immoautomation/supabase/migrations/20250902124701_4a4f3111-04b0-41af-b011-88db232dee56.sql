-- Grant necessary permissions to supabase_auth_admin for the profiles table
GRANT INSERT, UPDATE, SELECT ON public.profiles TO supabase_auth_admin;

-- Grant usage on the sequence if needed
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;