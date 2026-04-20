'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StatCard } from '@/components/stat-card'
import { ArrowRight, Zap, Target, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Sistem Cerdas Penghitung Ayam Otomatis
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Deteksi dan hitung jumlah ayam dengan teknologi AI YOLOv12. Hemat waktu, kurangi kesalahan, tingkatkan efisiensi peternakan Anda.
            </p>
            <Link href="/login">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                Mulai Hitung Ayam
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>

          {/* Illustration */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl h-80 flex items-center justify-center border border-primary/20">
            <div className="text-center">
              <div className="text-6xl mb-4">🐔</div>
              <p className="text-foreground font-semibold">Kandang Ayam Modern</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground text-lg">
              Teknologi AI terdepan untuk solusi peternakan ayam
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl p-6 bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="bg-accent/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-accent" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Upload Gambar Ayam</h3>
              <p className="text-muted-foreground">
                Upload gambar kandang ayam dengan mudah melalui drag & drop atau klik
              </p>
            </div>

            <div className="rounded-xl p-6 bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="bg-accent/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-accent" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Deteksi Otomatis</h3>
              <p className="text-muted-foreground">
                AI YOLOv12 mendeteksi setiap ayam dalam gambar dengan akurasi tinggi
              </p>
            </div>

            <div className="rounded-xl p-6 bg-background border border-border hover:border-primary/50 transition-colors">
              <div className="bg-accent/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-accent" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Hitung Jumlah Ayam</h3>
              <p className="text-muted-foreground">
                Dapatkan hasil perhitungan akurat dengan detail bounding box per ayam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Manfaat untuk Peternak
            </h2>
            <p className="text-muted-foreground text-lg">
              Solusi yang dirancang khusus untuk meningkatkan produktivitas peternakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Menghemat Waktu Peternak</h3>
                <p className="text-muted-foreground">
                  Proses hitung otomatis yang sebelumnya memakan waktu berjam-jam kini hanya beberapa detik
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Mengurangi Kesalahan Perhitungan Manual</h3>
                <p className="text-muted-foreground">
                  AI menghilangkan kesalahan manusia dan memberikan hasil yang konsisten dan dapat diandalkan
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Data Monitoring Real-time</h3>
                <p className="text-muted-foreground">
                  Pantau populasi ayam Anda secara real-time untuk manajemen yang lebih baik
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Optimasi Produktivitas</h3>
                <p className="text-muted-foreground">
                  Analisis data membantu Anda membuat keputusan yang lebih baik untuk peternakan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
