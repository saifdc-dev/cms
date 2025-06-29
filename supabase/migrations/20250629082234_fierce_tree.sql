/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - Current RLS policies on profiles table are causing infinite recursion
    - The policies are referencing the profiles table within their own conditions
    - This creates a loop when Supabase tries to evaluate the policies

  2. Solution
    - Drop existing problematic policies
    - Create new simplified policies that use auth.uid() directly
    - Ensure policies don't reference the profiles table in their conditions

  3. New Policies
    - Users can read all profiles (for public profile viewing)
    - Users can insert their own profile
    - Users can update their own profile
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);