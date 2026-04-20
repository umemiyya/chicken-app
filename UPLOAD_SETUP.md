# Setup Upload Dataset di Supabase

## 1. Siapkan Supabase Storage Bucket

Buka dashboard Supabase project Anda dan ikuti langkah-langkah berikut:

### Step 1: Buat Storage Bucket
- Masuk ke **Storage** di sidebar
- Klik **Create a new bucket**
- Nama bucket: `dataset-images`
- Pilih **Public bucket** (agar gambar bisa diakses public)
- Klik **Create bucket**

### Step 2: Buat Database Table
Buka **SQL Editor** dan jalankan query berikut:

```sql
-- Buat table dataset_images
CREATE TABLE IF NOT EXISTS public.dataset_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dataset_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert their own images"
  ON public.dataset_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own images"
  ON public.dataset_images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON public.dataset_images
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.dataset_images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_dataset_images_user_id ON public.dataset_images(user_id);
```

## 2. Setup Supabase Storage Policies

Di Storage bucket `dataset-images`, setup RLS policies:

### Policy 1: Authenticated users can upload
```sql
-- Authentication required
((bucket_id = 'dataset-images') AND 
 ((auth.role() = 'authenticated'::text)) AND 
 ((storage.foldername(name))[1] = auth.uid()::text))
```

### Policy 2: Public can read
```sql
-- No restrictions
(bucket_id = 'dataset-images')
```

## 3. Test Upload Feature

1. Buka aplikasi di `/admin`
2. Login dengan admin: `admin@example.com` / `admin123`
3. Di section "Upload Dataset", klik tombol "Pilih & Upload Gambar"
4. Pilih satu atau beberapa gambar dari komputer Anda
5. Tunggu upload selesai (lihat console untuk debugging jika ada error)

## 4. Monitoring Upload

Buka browser Developer Tools (F12):
- Buka tab **Console**
- Cari log dengan prefix `[v0]`
- Ini akan menunjukkan:
  - File yang dipilih
  - Progress upload
  - Error jika ada
  - Gambar yang berhasil diupload

## 5. Troubleshooting

### Error: "Anda harus login terlebih dahulu"
- Pastikan Anda sudah login sebagai admin
- Refresh halaman dan login ulang

### Error: "Gagal mengupload ke storage: ..."
- Pastikan bucket `dataset-images` sudah dibuat
- Pastikan bucket permission adalah **Public**
- Cek di Supabase dashboard > Storage > dataset-images

### Error: "Gagal menyimpan data: ..."
- Pastikan table `dataset_images` sudah dibuat
- Jalankan SQL query di atas untuk membuat table
- Cek RLS policies di table

### Gambar tidak muncul di gallery
- Refresh halaman
- Buka console (F12) dan cek apakah ada error
- Pastikan public_url di database benar

## 6. File Upload Details

- **Max file size**: 10MB per file
- **Allowed formats**: JPG, PNG, WebP dan image formats lainnya
- **Upload location**: `datasets/{user_id}/{filename}`
- **Database**: Menyimpan metadata di table `dataset_images`
- **Public URL**: Otomatis di-generate setelah upload berhasil

## 7. Admin Access

Fitur upload hanya bisa diakses oleh admin. Untuk login sebagai admin:
- Email: `admin@example.com`
- Password: `admin123`

User biasa hanya bisa melihat fitur deteksi ayam.
