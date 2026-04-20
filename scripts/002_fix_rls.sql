-- Drop all existing policies on dataset_images table
DROP POLICY IF EXISTS "idk" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow select for all" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow update for own records" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow delete for own records" ON public.dataset_images;

-- Disable RLS completely on dataset_images table
ALTER TABLE public.dataset_images DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_images TO authenticated;

-- Verify RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'dataset_images';
