'use client'

import { Bird } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bird size={24} />
              <span className="text-xl font-bold">AyamAI</span>
            </div>
            <p className="text-sm opacity-90">Solusi cerdas untuk peternak ayam modern</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/" className="hover:opacity-100 transition-opacity">Beranda</a></li>
              <li><a href="/deteksi" className="hover:opacity-100 transition-opacity">Deteksi Ayam</a></li>
              <li><a href="/informasi" className="hover:opacity-100 transition-opacity">Informasi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <p className="text-sm opacity-90">Email: info@ayamai.com</p>
            <p className="text-sm opacity-90">Telepon: +62 xxx-xxxx-xxxx</p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm opacity-90">&copy; 2024 AyamAI. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
