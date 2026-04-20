'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { UploadBox } from '@/components/upload-box'
import { Play, Download, RefreshCw, Loader, Eye, Share2, CheckCircle2 } from 'lucide-react'

interface Detection {
  id: number
  x: number
  y: number
  width: number
  height: number
  confidence: number
  label: string
}

interface APIResult {
  count?: number
  predictions?: Array<{
    x: number
    y: number
    width: number
    height: number
    confidence: number
    class: string
  }>
  visualization?: string
  image?: string
}

export default function DeteksiPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectionData, setDetectionData] = useState<{
    result: APIResult
    fileName: string
  } | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [detectionResults, setDetectionResults] = useState<any>(null)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setError(null)
  }

  // const handleProcess = async () => {
  //   if (!selectedImage) return

  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     // Convert file to base64
  //     const base64String = await new Promise<string>((resolve, reject) => {
  //       const reader = new FileReader()
  //       reader.onload = (e) => {
  //         const result = e.target?.result as string
  //         resolve(result)
  //       }
  //       reader.onerror = () => reject(new Error('Failed to read file'))
  //       reader.readAsDataURL(selectedImage)
  //     })

  //     console.log('[v0] Sending to Roboflow API...')

  //     // Call Roboflow API
  //     const response = await fetch('https://serverless.roboflow.com/lumiares-workspace/workflows/detect-count-and-visualize', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         api_key: 'C5M2Skv7atL7TgYUz0tY',
  //         inputs: {
  //           image: {
  //             type: 'base64',
  //             value: base64String.split(',')[1],
  //           },
  //         },
  //       }),
  //     })

  //     console.log('[v0] API Response status:', response.status)

  //     if (!response.ok) {
  //       throw new Error(`API Error: ${response.status} ${response.statusText}`)
  //     }

  //     const result = await response.json()
  //     console.log('[v0] Detection result:', result)

  //     // Set detection data directly
  //     const normalizedResult = result.outputs[0].predictions
  //     const apiResult = normalizedResult
  //     console.log('[v0] API Result:', apiResult)
  //     const totalChickens = apiResult.count || apiResult.predictions?.length || 0
  //     const avgConfidence = apiResult.predictions && apiResult.predictions.length > 0
  //       ? (apiResult.predictions.reduce((sum: number, p: any) => sum + (p.confidence || 0), 0) / apiResult.predictions.length) * 100
  //       : 0

  //     setDetectionResults({
  //       totalChickens,
  //       avgConfidence: avgConfidence.toFixed(1),
  //       processingTime: 2.5,
  //       timestamp: new Date().toLocaleString('id-ID'),
  //       imageFile: selectedImage.name,
  //       resolutionInWidth: 1920,
  //       resolutionInHeight: 1080,
  //     })

  //     // Transform API predictions to detections
  //     const detectionList: Detection[] = (apiResult.predictions || []).map((pred: any, idx: number) => ({
  //       id: idx + 1,
  //       x: Math.round(pred.x || 0),
  //       y: Math.round(pred.y || 0),
  //       width: Math.round(pred.width || 0),
  //       height: Math.round(pred.height || 0),
  //       confidence: Math.round((pred.confidence || 0) * 100 * 10) / 10,
  //       label: pred.class || 'Ayam',
  //     }))

  //     setDetections(detectionList)

  //     setDetectionData({
  //       result: apiResult,
  //       fileName: selectedImage.name,
  //     })

  //     console.log('[v0] Detection complete, showing results')
  //   } catch (err) {
  //     console.error('[v0] Error:', err)
  //     setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.')
  //     setIsLoading(false)
  //   }
  // }
const handleProcess = async () => {
  if (!selectedImage) return

  setIsLoading(true)
  setError(null)

  try {
    // Convert file to base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        resolve(result)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(selectedImage)
    })

    // console.log('[v0] Sending to Roboflow API...')

    // Call API
    // const response = await fetch(
    //   'https://serverless.roboflow.com/lumiares-workspace/workflows/detect-count-and-visualize',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       api_key: 'C5M2Skv7atL7TgYUz0tY',
    //       inputs: {
    //         image: {
    //           type: 'base64',
    //           value: base64String.split(',')[1],
    //         },
    //       },
    //     }),
    //   }
    // )

    const response = await fetch('/api/detect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: {
      type: 'base64',
      value: base64String.split(',')[1],
    },
  }),
})

    console.log('API Response status:', response.status)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    // console.log('[v0] Detection result:', result)

    // ✅ FIX FINAL: ambil array yang BENAR
    const predictionsRaw =
      result.outputs?.[0]?.predictions?.predictions

    const predictions = Array.isArray(predictionsRaw)
      ? predictionsRaw
      : []

    // console.log('[v0] Predictions:', predictions)

    // ✅ TOTAL AYAM
    const totalChickens = predictions.length

    // ✅ AVG CONFIDENCE
    const avgConfidence =
      predictions.length > 0
        ? (predictions.reduce((sum: number, p: any) => sum + (p.confidence || 0), 0) /
            predictions.length) *
          100
        : 0

    // ✅ RESOLUSI GAMBAR (AKURAT DARI API)
    const resolutionWidth =
      result.outputs?.[0]?.predictions?.image?.width || 0

    const resolutionHeight =
      result.outputs?.[0]?.predictions?.image?.height || 0

    // ✅ SET RESULT
    setDetectionResults({
      totalChickens,
      avgConfidence: avgConfidence.toFixed(1),
      processingTime: 2.5,
      timestamp: new Date().toLocaleString('id-ID'),
      imageFile: selectedImage.name,
      resolutionInWidth: resolutionWidth,
      resolutionInHeight: resolutionHeight,
    })

    // ✅ MAP DETECTIONS (SUDAH AMAN)
    const detectionList: Detection[] = predictions.map(
      (pred: any, idx: number) => ({
        id: idx + 1,
        x: Math.round(pred.x || 0),
        y: Math.round(pred.y || 0),
        width: Math.round(pred.width || 0),
        height: Math.round(pred.height || 0),
        confidence:
          Math.round((pred.confidence || 0) * 100 * 10) / 10,
        label: pred.class || 'Ayam',
      })
    )

    setDetections(detectionList)

    // ✅ SIMPAN DATA
    setDetectionData({
      result: {
        predictions: predictions,
        image: result.outputs?.[0]?.image || null,
      },
      fileName: selectedImage.name,
    })

    // console.log('[v0] Detection complete, showing results')
  } catch (err) {
    console.error('Error:', err)
    setError(
      err instanceof Error
        ? err.message
        : 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.'
    )
  } finally {
    setIsLoading(false)
  }
}

  const handleReset = () => {
    setSelectedImage(null)
    setDetectionData(null)
    setDetections([])
    setDetectionResults(null)
    setError(null)
  }

  // Tampilkan hasil deteksi jika sudah ada
  if (detectionData && detectionResults) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Hasil Deteksi Ayam
                  </h1>

                  <p className="text-muted-foreground">
                    Analisis gambar kandang ayam menggunakan AI YOLOv12
                  </p>
                </div>
                {/* <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Download size={20} />
                    <span>Unduh</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                    <Share2 size={20} />
                    <span>Bagikan</span>
                  </button>
                </div> */}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">File Gambar</p>
                  <p className="font-bold text-foreground text-sm">{detectionResults.imageFile}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Waktu Proses</p>
                  <p className="font-bold text-foreground text-sm">{detectionResults.processingTime}s</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Deteksi</p>
                  <p className="font-bold text-foreground text-sm">{detections.length} ayam</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Waktu Deteksi</p>
                  <p className="font-bold text-foreground text-sm">{detectionResults.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview with API visualization */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="relative bg-muted overflow-auto max-h-96 md:max-h-[600px] flex items-center justify-center">
                    {detectionData.result.visualization ? (
                      <img
                        src={`data:image/png;base64,${detectionData.result.visualization}`}
                        alt="Detection result with bounding boxes"
                        className="w-full h-auto"
                        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                      />
                    ) : detectionData.result.image ? (
                      <img
                        src={`data:image/jpeg;base64,${detectionData.result?.image?.value}`}
                        alt="Detection result"
                        className="w-full h-auto"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                          transformOrigin: 'center',
                        }}
                      />
                    ) : (
                      <div className="text-center p-8">
                        <p className="text-muted-foreground">Gambar visualisasi tidak tersedia</p>
                        <p>{JSON.stringify(detectionData.result.image)}</p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="p-4 border-t border-border bg-muted/30 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Zoom</label>
                        <span className="text-sm text-muted-foreground">{zoomLevel}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Sidebar */}
              <div className="space-y-4">
                {/* Total Count */}
                <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-primary-foreground">
                  <p className="text-sm opacity-90 mb-2">Total Ayam Terdeteksi</p>
                  <p className="text-5xl font-bold mb-2">{detectionResults.totalChickens}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} />
                    <span>Deteksi Selesai</span>
                  </div>
                </div>

                {/* Average Confidence */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-3">Rata-rata Confidence</p>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-accent"
                        strokeDasharray={`${(parseFloat(detectionResults.avgConfidence) / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">{detectionResults.avgConfidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-foreground py-3 rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  <RefreshCw size={20} />
                  <span>Deteksi Ulang</span>
                </button>
              </div>
            </div>

            {/* Detections Table */}
            {detections.length > 0 && (
              <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Eye size={20} className="text-primary" />
                    Daftar Deteksi ({detections.length} ayam)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">No</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Label</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Confidence</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Posisi X</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Posisi Y</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((detection, idx) => (
                        <tr key={detection.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">#{idx + 1}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{detection.label}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent transition-all"
                                  style={{ width: `${detection.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground w-12 text-right">
                                {detection.confidence}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{detection.x}px</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{detection.y}px</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent">
                              Terdeteksi
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    )
  }

  // Tampilkan form upload jika belum ada deteksi
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Deteksi Ayam dengan AI
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload gambar kandang ayam dan biarkan AI menghitung jumlahnya secara otomatis
            </p>
          </div>

          {/* Upload and Result Container */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Upload Gambar</h2>
              <UploadBox onImageSelect={handleImageSelect} />

              {error && (
                <div className="bg-destructive/10 border border-destructive rounded-xl p-4">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {selectedImage && !isLoading && (
                <button
                  onClick={handleProcess}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Proses Hitung Ayam
                </button>
              )}

              {isLoading && (
                <button
                  disabled
                  className="w-full bg-primary/50 text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Loader size={20} className="animate-spin" />
                  Sedang Memproses...
                </button>
              )}

              {selectedImage && !isLoading && (
                <button
                  onClick={handleReset}
                  className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Upload Gambar Lain
                </button>
              )}
            </div>

            {/* Info */}
            <div className="bg-secondary/30 border border-secondary rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Tips Menggunakan Aplikasi</h3>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>• Pastikan cahaya cukup untuk hasil deteksi yang optimal</li>
                <li>• Gunakan gambar dengan resolusi tinggi (minimum 720p)</li>
                <li>• Hindari blur atau gambar yang terlalu gelap</li>
                <li>• Posisi kamera sedemikian rupa agar dapat melihat sebanyak mungkin ayam</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
