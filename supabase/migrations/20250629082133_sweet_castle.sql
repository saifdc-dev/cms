/*
  # Fix infinite recursion in profiles RLS policies

  1. Security Changes
    - Drop existing problematic policies that cause infinite recursion
    - Create new policies that don't reference the profiles table from within itself
    - Use auth.uid() directly instead of checking profiles table for admin status
    - Implement a simpler, non-recursive approach to RLS

  2. Policy Changes
    - Remove the recursive admin check policy
    - Keep user self-management policy
    - Add a simple read policy for authenticated users
    - Use a different approach for admin management that doesn't cause recursion
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new non-recursive policies
-- Allow users to read all profiles (authenticated users only)
CREATE POLICY "Authenticated users can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (for new user registration)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- For admin operations, we'll handle this at the application level
-- rather than through RLS to avoid recursion issues
-- Admins can be identified by checking the role after fetching the profile