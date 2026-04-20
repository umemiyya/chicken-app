'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin',
  id: 'admin_hardcoded',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: 'user',
          }
          setUser(userData)
        }
      } catch (err) {
        console.error('[v0] Error checking session:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: 'user',
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    // Check if admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: ADMIN_CREDENTIALS.id,
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: 'admin',
      }
      setUser(adminUser)
      return { success: true }
    }

    // Else use Supabase
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, message: 'Terjadi kesalahan saat login' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
          data: {
            name,
          },
        },
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true, message: 'Silakan periksa email Anda untuk konfirmasi' }
    } catch (err) {
      return { success: false, message: 'Terjadi kesalahan saat signup' }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, message: 'Terjadi kesalahan saat login dengan Google' }
    }
  }

  const logout = async () => {
    // For admin, just clear state
    if (user?.role === 'admin') {
      setUser(null)
      return
    }

    // For regular users, sign out from Supabase
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (err) {
      console.error('[v0] Error logging out:', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        signUp,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Return a default context if not found (for development/ssr compatibility)
    return {
      user: null,
      isLoggedIn: false,
      isLoading: true,
      login: async () => ({ success: false, message: 'Auth context not available' }),
      signUp: async () => ({ success: false, message: 'Auth context not available' }),
      signInWithGoogle: async () => ({ success: false, message: 'Auth context not available' }),
      logout: async () => {},
    }
  }
  return context
}
