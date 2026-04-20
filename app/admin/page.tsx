// 'use client'

// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/app/context/auth-context'
// import { Navbar } from '@/components/navbar'
// import { Footer } from '@/components/footer'
// import { Upload, Users, Settings, BarChart3, AlertCircle, Trash2, Download } from 'lucide-react'
// import { useEffect, useState } from 'react'

// interface DatasetImage {
//   name: string
//   path: string
//   url: string
// }

// export default function AdminPage() {
//   const router = useRouter()
//   const { isLoggedIn, user } = useAuth()
//   const [isAuthorized, setIsAuthorized] = useState(false)
//   const [datasetImages, setDatasetImages] = useState<DatasetImage[]>([])
//   const [isLoadingDataset, setIsLoadingDataset] = useState(true)
//   const [selectedImage, setSelectedImage] = useState<DatasetImage | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadError, setUploadError] = useState<string | null>(null)
//   const [uploadSuccess, setUploadSuccess] = useState(false)

//   // Check if admin
//   useEffect(() => {
//     if (!isLoggedIn) {
//       router.push('/login')
//     } else if (user?.role !== 'admin') {
//       router.push('/deteksi')
//     } else {
//       setIsAuthorized(true)
//     }
//   }, [isLoggedIn, user, router])

//   // Load dataset images
//   useEffect(() => {
//     const loadDataset = async () => {
//       try {
//         const response = await fetch('/api/dataset')
//         const data = await response.json()
//         if (data.success) {
//           setDatasetImages(data.images)
//         }
//       } catch (error) {
//         console.error('[v0] Error loading dataset:', error)
//       } finally {
//         setIsLoadingDataset(false)
//       }
//     }

//     if (isAuthorized) {
//       loadDataset()
//     }
//   }, [isAuthorized])

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files || files.length === 0) {
//       console.log('[v0] No files selected')
//       return
//     }

//     console.log('[v0] Selected files:', files.length)
//     setUploadError(null)
//     setUploadSuccess(false)
//     setIsUploading(true)

//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i]
//         console.log(`[v0] Uploading file ${i + 1}/${files.length}:`, file.name, file.size, file.type)
        
//         const formData = new FormData()
//         formData.append('file', file)

//         // Add admin auth header if user is admin
//         const headers: Record<string, string> = {}
//         if (user?.role === 'admin') {
//           headers['x-admin-auth'] = 'admin_hardcoded'
//           console.log('[v0] Added admin auth header')
//         }

//         const response = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData,
//           headers,
//         })

//         console.log('[v0] Upload response status:', response.status)
//         const data = await response.json()
//         console.log('[v0] Upload response data:', data)

//         if (!data.success) {
//           setUploadError(data.message || 'Upload gagal')
//           setIsUploading(false)
//           return
//         }

//         // Add to local state
//         setDatasetImages((prev) => [
//           ...prev,
//           {
//             name: data.data.filename || file.name,
//             path: data.data.url,
//             url: data.data.url,
//           },
//         ])
        
//         console.log('[v0] File uploaded successfully:', file.name)
//       }

//       setUploadSuccess(true)
//       console.log('[v0] All files uploaded successfully')
//       setTimeout(() => setUploadSuccess(false), 3000)
//     } catch (error) {
//       const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan saat upload'
//       setUploadError(errorMsg)
//       console.error('[v0] Upload error:', error)
//     } finally {
//       setIsUploading(false)
//       // Reset input
//       e.target.value = ''
//     }
//   }

//   const handleUploadClick = () => {
//     const input = document.getElementById('dataset-upload-input') as HTMLInputElement
//     if (input) {
//       input.click()
//     }
//   }

//   if (!isAuthorized) {
//     return null
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <Navbar />

//       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-12">
//             <h1 className="text-4xl font-bold text-foreground mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-muted-foreground text-lg">
//               Kelola model AI, dataset, dan konfigurasi sistem
//             </p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid md:grid-cols-4 gap-4 mb-12">
//             <div className="bg-card border border-border rounded-xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-muted-foreground text-sm mb-1">Total Deteksi</p>
//                   <p className="text-3xl font-bold text-foreground">1,234</p>
//                 </div>
//                 <div className="text-4xl opacity-20">📊</div>
//               </div>
//             </div>

//             <div className="bg-card border border-border rounded-xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-muted-foreground text-sm mb-1">Pengguna Aktif</p>
//                   <p className="text-3xl font-bold text-foreground">45</p>
//                 </div>
//                 <div className="text-4xl opacity-20">👥</div>
//               </div>
//             </div>

//             <div className="bg-card border border-border rounded-xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-muted-foreground text-sm mb-1">Model Accuracy</p>
//                   <p className="text-3xl font-bold text-foreground">94.2%</p>
//                 </div>
//                 <div className="text-4xl opacity-20">🎯</div>
//               </div>
//             </div>

//             <div className="bg-card border border-border rounded-xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-muted-foreground text-sm mb-1">Dataset Images</p>
//                   <p className="text-3xl font-bold text-foreground">{datasetImages.length}</p>
//                 </div>
//                 <div className="text-4xl opacity-20">📸</div>
//               </div>
//             </div>
//           </div>

//           {/* Admin Features */}
//           <div className="grid md:grid-cols-2 gap-6 mb-12">
//             {/* Dataset Management */}
//             <div className="bg-card border border-border rounded-2xl p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-primary/10 p-3 rounded-lg">
//                     <Upload className="text-primary" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-foreground">Upload Dataset</h3>
//                     <p className="text-muted-foreground text-sm">Tambah training data baru</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 {uploadError && (
//                   <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
//                     <p className="text-destructive text-sm">{uploadError}</p>
//                   </div>
//                 )}
//                 {uploadSuccess && (
//                   <div className="bg-accent/10 border border-accent rounded-lg p-3">
//                     <p className="text-accent text-sm">File berhasil diupload!</p>
//                   </div>
//                 )}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Upload Gambar Dataset
//                   </label>
//                   <div 
//                     onClick={handleUploadClick}
//                     className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
//                   >
//                     <div className="text-4xl mb-2">📸</div>
//                     <p className="text-sm font-medium text-foreground">
//                       Klik untuk memilih gambar
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-2">
//                       Format: JPG, PNG, WebP (Max 10MB per file)
//                     </p>
//                   </div>
//                   <input
//                     id="dataset-upload-input"
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     disabled={isUploading}
//                     className="hidden"
//                   />
//                 </div>
//                 <button
//                   onClick={handleUploadClick}
//                   disabled={isUploading}
//                   className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   <Upload size={20} />
//                   {isUploading ? 'Sedang Mengupload...' : 'Pilih & Upload Gambar'}
//                 </button>
//               </div>
//             </div>

//             {/* Model Training */}
//             <div className="bg-card border border-border rounded-2xl p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-accent/10 p-3 rounded-lg">
//                     <BarChart3 className="text-accent" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-foreground">Training Model</h3>
//                     <p className="text-muted-foreground text-sm">Train model dengan dataset baru</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Pilih Konfigurasi
//                   </label>
//                   <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground">
//                     <option>YOLOv12 - High Accuracy</option>
//                     <option>YOLOv12 - Balanced</option>
//                     <option>YOLOv12 - Fast</option>
//                   </select>
//                 </div>
//                 <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium">
//                   Mulai Training
//                 </button>
//               </div>
//             </div>

//             {/* User Management */}
//             <div className="bg-card border border-border rounded-2xl p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-secondary p-3 rounded-lg">
//                     <Users className="text-foreground" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-foreground">Manajemen Pengguna</h3>
//                     <p className="text-muted-foreground text-sm">Kelola akun pengguna</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-3 mb-4">
//                 <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                   <div>
//                     <p className="font-medium text-foreground text-sm">user@example.com</p>
//                     <p className="text-xs text-muted-foreground">Regular User</p>
//                   </div>
//                   <button className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors">
//                     Edit
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                   <div>
//                     <p className="font-medium text-foreground text-sm">admin@example.com</p>
//                     <p className="text-xs text-accent">Administrator</p>
//                   </div>
//                   <button className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors">
//                     Edit
//                   </button>
//                 </div>
//               </div>
//               <button className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm">
//                 Tambah Pengguna Baru
//               </button>
//             </div>

//             {/* System Settings */}
//             <div className="bg-card border border-border rounded-2xl p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-start gap-4">
//                   <div className="bg-muted p-3 rounded-lg">
//                     <Settings className="text-foreground" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-foreground">Pengaturan Sistem</h3>
//                     <p className="text-muted-foreground text-sm">Konfigurasi aplikasi</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                   <span className="text-sm text-foreground">Confidence Threshold</span>
//                   <input type="range" min="0" max="100" defaultValue="80" className="w-24" />
//                 </div>
//                 <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                   <span className="text-sm text-foreground">Max Upload Size (MB)</span>
//                   <input type="number" defaultValue="100" className="w-20 px-2 py-1 bg-background border border-border rounded text-foreground" />
//                 </div>
//                 <button className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm">
//                   Simpan Pengaturan
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Dataset Gallery Section */}
//           <div className="mb-12">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground">Dataset Gallery</h2>
//                 <p className="text-muted-foreground">Semua gambar training yang tersedia</p>
//               </div>
//               <div className="text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
//                 Total: {datasetImages.length} gambar
//               </div>
//             </div>

//             {isLoadingDataset ? (
//               <div className="flex items-center justify-center py-12">
//                 <p className="text-muted-foreground">Memuat dataset...</p>
//               </div>
//             ) : datasetImages.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 {datasetImages.map((image) => (
//                   <div
//                     key={image.name}
//                     onClick={() => setSelectedImage(image)}
//                     className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-all hover:shadow-lg"
//                   >
//                     <div className="aspect-square overflow-hidden bg-muted">
//                       <img
//                         src={image.url}
//                         alt={image.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//                       <button className="p-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors">
//                         <Download size={16} className="text-primary-foreground" />
//                       </button>
//                       <button className="p-2 bg-destructive rounded-lg hover:bg-destructive/90 transition-colors">
//                         <Trash2 size={16} className="text-destructive-foreground" />
//                       </button>
//                     </div>
//                     <div className="p-2 bg-muted/50 border-t border-border">
//                       <p className="text-xs font-medium text-foreground truncate">{image.name}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-card border border-border rounded-lg p-12 text-center">
//                 <p className="text-muted-foreground">Tidak ada gambar dataset</p>
//               </div>
//             )}
//           </div>

//           {/* Image Preview Modal */}
//           {selectedImage && (
//             <div
//               className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//               onClick={() => setSelectedImage(null)}
//             >
//               <div
//                 className="bg-card rounded-2xl max-w-2xl w-full overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between p-6 border-b border-border bg-muted/50">
//                   <h3 className="font-bold text-foreground">{selectedImage.name}</h3>
//                   <button
//                     onClick={() => setSelectedImage(null)}
//                     className="text-muted-foreground hover:text-foreground text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>
//                 <div className="bg-muted aspect-video overflow-hidden">
//                   <img
//                     src={selectedImage.url}
//                     alt={selectedImage.name}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//                 <div className="p-6 border-t border-border flex gap-3">
//                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
//                     <Download size={16} />
//                     Download
//                   </button>
//                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
//                     <Trash2 size={16} />
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setSelectedImage(null)}
//                     className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Alert */}
//           <div className="bg-accent/10 border border-accent rounded-xl p-6 flex items-start gap-4">
//             <AlertCircle className="text-accent flex-shrink-0 mt-1" size={20} />
//             <div>
//               <h4 className="font-bold text-foreground mb-1">Info Demo</h4>
//               <p className="text-sm text-muted-foreground">
//                 Ini adalah dashboard admin demo. Semua fitur hanya untuk tampilan UI. Untuk fitur sebenarnya, diperlukan backend development.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </main>
//   )
// }



'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Upload, Users, Settings, BarChart3, AlertCircle, Trash2, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DatasetImage {
  name: string
  path: string
  url: string
}

export default function AdminPage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [datasetImages, setDatasetImages] = useState<DatasetImage[]>([])
  const [isLoadingDataset, setIsLoadingDataset] = useState(true)
  const [selectedImage, setSelectedImage] = useState<DatasetImage | null>(null)

  // Check if admin
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else if (user?.role !== 'admin') {
      router.push('/deteksi')
    } else {
      setIsAuthorized(true)
    }
  }, [isLoggedIn, user, router])

  // Load dataset images
  useEffect(() => {
    const loadDataset = async () => {
      try {
        const response = await fetch('/api/dataset')
        const data = await response.json()
        if (data.success) {
          setDatasetImages(data.images)
        }
      } catch (error) {
        console.error('Error loading dataset:', error)
      } finally {
        setIsLoadingDataset(false)
      }
    }

    if (isAuthorized) {
      loadDataset()
    }
  }, [isAuthorized])

  if (!isAuthorized) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Kelola model AI, dataset, dan konfigurasi sistem
            </p>
          </div>

          {/* Stats Grid */}
          {/* <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Deteksi</p>
                  <p className="text-3xl font-bold text-foreground">1,234</p>
                </div>
                <div className="text-4xl opacity-20">📊</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Pengguna Aktif</p>
                  <p className="text-3xl font-bold text-foreground">45</p>
                </div>
                <div className="text-4xl opacity-20">👥</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Model Accuracy</p>
                  <p className="text-3xl font-bold text-foreground">94.2%</p>
                </div>
                <div className="text-4xl opacity-20">🎯</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Dataset Images</p>
                  <p className="text-3xl font-bold text-foreground">{datasetImages.length}</p>
                </div>
                <div className="text-4xl opacity-20">📸</div>
              </div>
            </div>
          </div> */}

          {/* Admin Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Dataset Management */}
            {/* <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Upload className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Upload Dataset</h3>
                    <p className="text-muted-foreground text-sm">Tambah training data baru</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Batch Dataset
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop atau klik untuk memilih folder dataset
                    </p>
                  </div>
                </div>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Upload Dataset
                </button>
              </div>
            </div> */}

            {/* Model Training */}
            {/* <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <BarChart3 className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Training Model</h3>
                    <p className="text-muted-foreground text-sm">Train model dengan dataset baru</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pilih Konfigurasi
                  </label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                    <option>YOLOv12 - High Accuracy</option>
                    <option>YOLOv12 - Balanced</option>
                    <option>YOLOv12 - Fast</option>
                  </select>
                </div>
                <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium">
                  Mulai Training
                </button>
              </div>
            </div> */}

            {/* User Management */}
            {/* <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <Users className="text-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Manajemen Pengguna</h3>
                    <p className="text-muted-foreground text-sm">Kelola akun pengguna</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">user@example.com</p>
                    <p className="text-xs text-muted-foreground">Regular User</p>
                  </div>
                  <button className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">admin@example.com</p>
                    <p className="text-xs text-accent">Administrator</p>
                  </div>
                  <button className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors">
                    Edit
                  </button>
                </div>
              </div>
              <button className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm">
                Tambah Pengguna Baru
              </button>
            </div> */}

            {/* System Settings */}
            {/* <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Settings className="text-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Pengaturan Sistem</h3>
                    <p className="text-muted-foreground text-sm">Konfigurasi aplikasi</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Confidence Threshold</span>
                  <input type="range" min="0" max="100" defaultValue="80" className="w-24" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">Max Upload Size (MB)</span>
                  <input type="number" defaultValue="100" className="w-20 px-2 py-1 bg-background border border-border rounded text-foreground" />
                </div>
                <button className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm">
                  Simpan Pengaturan
                </button>
              </div>
            </div> */}
          </div>

          {/* Dataset Gallery Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dataset Gallery</h2>
                <p className="text-muted-foreground">Semua gambar training yang tersedia</p>
              </div>
              <div className="text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border">
                Total: {datasetImages.length} gambar
              </div>
            </div>

            {isLoadingDataset ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Memuat dataset...</p>
              </div>
            ) : datasetImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {datasetImages.map((image) => (
                  <div
                    key={image.name}
                    onClick={() => setSelectedImage(image)}
                    className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-all hover:shadow-lg"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                        <Download size={16} className="text-primary-foreground" />
                      </button>
                      <button className="p-2 bg-destructive rounded-lg hover:bg-destructive/90 transition-colors">
                        <Trash2 size={16} className="text-destructive-foreground" />
                      </button>
                    </div>
                    <div className="p-2 bg-muted/50 border-t border-border">
                      <p className="text-xs font-medium text-foreground truncate">{image.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground">Tidak ada gambar dataset</p>
              </div>
            )}
          </div>

          {/* Image Preview Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="bg-card rounded-2xl max-w-2xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/50">
                  <h3 className="font-bold text-foreground">{selectedImage.name}</h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-muted-foreground hover:text-foreground text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="bg-muted aspect-video overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6 border-t border-border flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Download size={16} />
                    Download
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
                    <Trash2 size={16} />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert */}
          {/* <div className="bg-accent/10 border border-accent rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="text-accent flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-foreground mb-1">Info Demo</h4>
              <p className="text-sm text-muted-foreground">
                Ini adalah dashboard admin demo. Semua fitur hanya untuk tampilan UI. Untuk fitur sebenarnya, diperlukan backend development.
              </p>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </main>
  )
}
