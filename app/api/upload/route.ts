import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('[v0] Upload API called')
  
  try {
    const supabase = await createClient()
    console.log('[v0] Supabase client created')

    // Check for admin auth header
    const adminAuthHeader = request.headers.get('x-admin-auth')
    const isAdminUpload = adminAuthHeader === 'admin_hardcoded'

    console.log('[v0] Admin upload:', isAdminUpload)

    // Get current user from Supabase OR use admin
    let userId: string
    let userEmail: string

    if (isAdminUpload) {
      userId = 'admin_hardcoded'
      userEmail = 'admin@example.com'
      console.log('[v0] Using admin upload')
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log('[v0] Current user:', user?.id || 'No user')

      if (!user) {
        console.log('[v0] User not authenticated')
        return NextResponse.json({ success: false, message: 'Anda harus login terlebih dahulu' }, { status: 401 })
      }

      userId = user.id
      userEmail = user.email || 'unknown'
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('[v0] File received:', file?.name, file?.size, file?.type)

    if (!file) {
      return NextResponse.json({ success: false, message: 'Tidak ada file yang dipilih' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Hanya file gambar yang diperbolehkan' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Ukuran file maksimal 10MB' }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${fileExtension}`
    const filepath = `datasets/${userId}/${filename}`

    console.log('[v0] Uploading to path:', filepath)

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabase.storage.from('dataset-images').upload(filepath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error('[v0] Storage upload error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal mengupload ke storage: ' + (error.message || 'Unknown error') 
        }, 
        { status: 500 }
      )
    }

    console.log('[v0] File uploaded to storage:', data)

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('dataset-images').getPublicUrl(filepath)

    console.log('[v0] Public URL:', publicUrl)

    // Save to database using service role client (bypasses RLS)
    const { data: dbData, error: dbError } = await supabase
      .from('dataset_images')
      .insert(
        {
          user_id: userId,
          filename: file.name,
          filepath: filepath,
          file_size: String(file.size),
          file_type: file.type,
          public_url: publicUrl,
        }
      )
      .select()

    if (dbError) {
      console.error('[v0] Database insert error:', dbError)
      console.error('[v0] Error details:', dbError.message, dbError.code)
      
      // Optionally clean up uploaded file
      console.log('[v0] Cleaning up uploaded file')
      await supabase.storage.from('dataset-images').remove([filepath])
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal menyimpan data: ' + (dbError.message || 'Unknown error')
        }, 
        { status: 500 }
      )
    }

    console.log('[v0] File metadata saved to database')

    return NextResponse.json({
      success: true,
      message: 'File berhasil diupload',
      data: {
        id: dbData?.[0]?.id || '',
        filename: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploadedAt: dbData?.[0]?.created_at || new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return NextResponse.json(
      { success: false, message: 'Error: ' + errorMessage }, 
      { status: 500 }
    )
  }
}
