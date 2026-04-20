'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Bird, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Bird className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">AyamAI</span>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-8">
            {isLoggedIn ? (
              <>
                {user?.role === 'user' && (
                  <Link href="/deteksi" className="text-foreground hover:text-primary transition-colors text-sm">
                    Deteksi Ayam
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link href="/admin" className="text-foreground hover:text-primary transition-colors text-sm">
                      Admin
                    </Link>
                    <Link href="/deteksi" className="text-foreground hover:text-primary transition-colors text-sm">
                      Deteksi Demo
                    </Link>
                  </>
                )}
                {/* <Link href="/informasi" className="text-foreground hover:text-primary transition-colors text-sm">
                  Informasi
                </Link> */}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-muted/50">
                        <p className="text-xs text-muted-foreground">Logged in as</p>
                        <p className="text-sm font-bold text-foreground">{user?.email}</p>
                        <p className="text-xs text-accent mt-1">
                          {user?.role === 'admin' ? 'Administrator' : 'User'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-foreground hover:bg-secondary transition-colors text-sm"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
