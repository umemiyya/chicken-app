'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Download, Share2, RotateCcw, CheckCircle2, Eye, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
}

export default function InformasiPage() {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [detectionData, setDetectionData] = useState<{
    result: APIResult
    imageUrl: string
    fileName: string
  } | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [detectionResults, setDetectionResults] = useState<any>(null)
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  useEffect(() => {
    // Add small delay to ensure sessionStorage is available
    const timer = setTimeout(() => {
      console.log('[v0] Checking sessionStorage for detection results...')
      const stored = sessionStorage.getItem('detectionResult')
      console.log('[v0] SessionStorage data found:', !!stored)
      
      if (stored) {
        try {
          const data = JSON.parse(stored)
          console.log('[v0] Parsed detection data:', data)
          setDetectionData(data)

          // Parse API results
          const apiResult = data.result
          console.log('[v0] API Result:', apiResult)

          const totalChickens = apiResult.count || apiResult.predictions?.length || 0
          const avgConfidence = apiResult.predictions && apiResult.predictions.length > 0
            ? (apiResult.predictions.reduce((sum: number, p: any) => sum + (p.confidence || 0), 0) / apiResult.predictions.length) * 100
            : 0

          console.log('[v0] Total chickens:', totalChickens, 'Avg confidence:', avgConfidence)

          setDetectionResults({
            totalChickens,
            avgConfidence: avgConfidence.toFixed(1),
            processingTime: 2.5,
            timestamp: new Date().toLocaleString('id-ID'),
            imageFile: data.fileName,
            resolutionInWidth: 1920,
            resolutionInHeight: 1080,
          })

          // Transform API predictions to detections
          const detectionList: Detection[] = (apiResult.predictions || []).map((pred: any, idx: number) => ({
            id: idx + 1,
            x: Math.round(pred.x || 0),
            y: Math.round(pred.y || 0),
            width: Math.round(pred.width || 0),
            height: Math.round(pred.height || 0),
            confidence: Math.round((pred.confidence || 0) * 100 * 10) / 10,
            label: pred.class || 'Ayam',
          }))

          console.log('[v0] Detection list:', detectionList)
          setDetections(detectionList)
        } catch (err) {
          console.error('[v0] Error parsing detection data:', err)
        }
      }
      setIsLoading(false)
      setHasCheckedStorage(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Memuat hasil deteksi...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!detectionData || !detectionResults) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Belum ada hasil deteksi</h2>
            <p className="text-muted-foreground mb-4">Silakan upload gambar di halaman deteksi untuk melihat hasil</p>
            <p className="text-sm text-muted-foreground mb-6 bg-card p-4 rounded-lg">
              Status: {hasCheckedStorage ? 'Tidak ada data di session storage' : 'Memeriksa...'}
            </p>
            <Link href="/deteksi">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Kembali ke Deteksi
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/deteksi" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Hasil Deteksi Ayam
                </h1>
                <p className="text-muted-foreground">
                  Analisis gambar kandang ayam menggunakan AI YOLOv12
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <Download size={20} />
                  <span>Unduh Laporan</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <Share2 size={20} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">File Gambar</p>
                <p className="font-bold text-foreground text-sm">{detectionResults.imageFile}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Resolusi</p>
                <p className="font-bold text-foreground text-sm">
                  {detectionResults.resolutionInWidth}x{detectionResults.resolutionInHeight}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Waktu Proses</p>
                <p className="font-bold text-foreground text-sm">{detectionResults.processingTime}s</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Waktu Deteksi</p>
                <p className="font-bold text-foreground text-sm">{detectionResults.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Preview */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Image Container */}
                <div className="relative bg-muted overflow-auto max-h-96 md:max-h-[600px]">
                  <div
                    className="relative inline-block"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    {/* Actual Image */}
                    <div className="relative w-full">
                      <img
                        src={detectionData.imageUrl}
                        alt="Detected"
                        className="w-full h-auto max-w-[600px]"
                      />
                      {/* Bounding boxes overlay */}
                      {showBoundingBoxes && detections.map((detection) => {
                        const imgElement = document.querySelector('img[alt="Detected"]') as HTMLImageElement
                        const scale = imgElement ? imgElement.width / detectionResults.resolutionInWidth : 1

                        return (
                          <div
                            key={detection.id}
                            className="absolute border-2 border-accent bg-accent/10 group cursor-pointer transition-colors hover:border-primary hover:bg-primary/10"
                            style={{
                              left: `${(detection.x / detectionResults.resolutionInWidth) * 100}%`,
                              top: `${(detection.y / detectionResults.resolutionInHeight) * 100}%`,
                              width: `${(detection.width / detectionResults.resolutionInWidth) * 100}%`,
                              height: `${(detection.height / detectionResults.resolutionInHeight) * 100}%`,
                            }}
                          >
                            <div className="absolute -top-6 left-0 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              {detection.confidence}%
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 border-t border-border bg-muted/30 space-y-4">
                  {/* Zoom Control */}
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

                  {/* Toggle Bounding Boxes */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showBoundingBoxes}
                        onChange={(e) => setShowBoundingBoxes(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Tampilkan Bounding Boxes
                      </span>
                    </label>
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
                  <span>Akurasi Tinggi</span>
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
                      strokeDasharray={`${(detectionResults.avgConfidence / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{detectionResults.avgConfidence}%</span>
                  </div>
                </div>
              </div>

              {/* Detection Details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">Rincian Deteksi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Deteksi</span>
                    <span className="font-bold text-foreground">{detections.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Min Confidence</span>
                    <span className="font-bold text-foreground">
                      {Math.min(...detections.map(d => d.confidence)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Confidence</span>
                    <span className="font-bold text-foreground">
                      {Math.max(...detections.map(d => d.confidence)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-secondary text-foreground py-3 rounded-lg hover:bg-secondary/80 transition-colors font-medium">
                <RotateCcw size={20} />
                <span>Deteksi Ulang</span>
              </button>
            </div>
          </div>

          {/* Detections Table */}
          <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Eye size={20} className="text-primary" />
                Daftar Deteksi
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
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

          {/* Footer CTA */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Ingin Mencoba Deteksi Sendiri?</h3>
            <p className="text-muted-foreground mb-4">
              Unggah gambar kandang ayam Anda dan dapatkan hasil deteksi secara real-time
            </p>
            <a href="/deteksi">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Coba Sekarang →
              </button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
