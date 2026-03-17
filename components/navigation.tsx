"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import supabase from "@/lib/supabaseClient"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Webinars", href: "/webinars" },
    { label: "Community", href: "/community" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  function AuthArea() {
    const { user, loading, session } = useAuth()
    const router = useRouter()

    const displayName =
      (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.fullName || (user as any)?.email

    const handleSignOut = async () => {
      await supabase.auth.signOut()
      router.push('/')
    }

    if (loading) return null

    if (!user)
      return (
        <button onClick={() => router.push('/login')} className="text-sm font-medium text-primary">
          Login
        </button>
      )

    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-foreground">
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-muted-foreground">{(user as any)?.email}</div>
        </div>
        <button onClick={handleSignOut} className="text-sm text-red-500">Sign out</button>
      </div>
    )
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
            aria-label="Home"
          >
            <img src="/faviconSP.png" alt="Shobha Pujari" className="h-10 w-auto" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="text-foreground hover:text-primary text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <AuthArea />
          </div>

          {/* Mobile controls: show theme toggle and menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

  
    </motion.nav>
  )
}
