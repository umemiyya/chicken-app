-- Create storage bucket for datasets
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', true)
ON CONFLICT (id) DO NOTHING;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create datasets table for tracking uploads
CREATE TABLE IF NOT EXISTS public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

-- Policies for datasets
CREATE POLICY "datasets_select_own" ON public.datasets 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "datasets_insert_own" ON public.datasets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "datasets_update_own" ON public.datasets 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "datasets_delete_own" ON public.datasets 
  FOR DELETE USING (auth.uid() = user_id);

-- Admin can view all datasets
CREATE POLICY "datasets_admin_all" ON public.datasets 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email IN ('admin@example.com')
    )
  );

-- Storage policies for datasets bucket
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'datasets');

CREATE POLICY "Allow users to view their uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admin can view all uploads
CREATE POLICY "Allow admin to view all uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'datasets' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email IN ('admin@example.com')
    )
  );
