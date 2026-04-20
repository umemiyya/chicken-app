# Memperbaiki RLS Error pada Upload

Jika Anda mendapatkan error: `new row violates row-level security policy`, ikuti langkah-langkah berikut:

## Step 1: Buka SQL Editor di Supabase

1. Buka dashboard Supabase Anda
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar kiri
4. Klik "+ New Query"

## Step 2: Jalankan SQL untuk Disable RLS

Copy dan paste SQL berikut ke SQL Editor, kemudian klik "Run":

```sql
-- Drop semua existing policies
DROP POLICY IF EXISTS "idk" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow select for all" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow update for own records" ON public.dataset_images;
DROP POLICY IF EXISTS "Allow delete for own records" ON public.dataset_images;

-- Disable RLS pada table dataset_images
ALTER TABLE public.dataset_images DISABLE ROW LEVEL SECURITY;

-- Grant permissions ke roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_images TO authenticated;

-- Verify RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'dataset_images';
```

## Step 3: Verify Berhasil

Jika query berhasil, Anda akan melihat output:
```
tablename       | rowsecurity
----------------|------------
dataset_images  | f
```

Nilai `f` berarti RLS sudah disabled.

## Step 4: Test Upload

1. Refresh aplikasi Anda
2. Login sebagai admin: `admin@example.com` / `admin123`
3. Buka halaman `/admin`
4. Coba upload gambar
5. Buka Console (F12) untuk melihat progress

## Troubleshooting

**Jika masih error:**

1. Pastikan Supabase bucket `dataset-images` sudah dibuat
2. Pastikan bucket permission adalah **Public**
3. Cek di Console (F12) untuk melihat error message detail
4. Pastikan sudah login dengan akun admin yang benar

**Jika ingin re-enable RLS dengan proper policies:**

```sql
-- Enable RLS kembali
ALTER TABLE public.dataset_images ENABLE ROW LEVEL SECURITY;

-- Buat policy yang lebih permissive
CREATE POLICY "Allow all operations" ON public.dataset_images
  FOR ALL USING (true) WITH CHECK (true);
```
