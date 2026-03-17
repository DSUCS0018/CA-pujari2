"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  session: Session | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      // unsubscribe listener
      // @ts-ignore
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, session }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
