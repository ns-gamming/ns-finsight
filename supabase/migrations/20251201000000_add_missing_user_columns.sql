
-- Add missing name column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_name ON public.users(name);
