"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, Users, Video } from "lucide-react"
import WebinarBookButton from "@/components/webinar-book-button"
import { motion } from "framer-motion"
import { fadeUp, stagger } from "@/lib/animations"
import supabase from "@/lib/supabaseClient"

function formatDateTime(iso?: string) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatDate(iso?: string) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

type Webinar = {
  id: string
  title: string
  description?: string
  starts_at?: string
  duration_minutes?: number
  platform?: string
  price?: string
  seats?: number
}

export default function WebinarsPage() {
  const [upcomingWebinars, setUpcoming] = useState<Webinar[]>([])
  const [pastWebinars, setPast] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/webinars')
        const json = await res.json()
        if (res.ok) {
          const data = (json.data as Webinar[]) ?? []
          const now = new Date()
          const upcoming = data.filter((w) => w.starts_at && new Date(w.starts_at) >= now)
          const past = data.filter((w) => !w.starts_at || new Date(w.starts_at) < now)
          if (mounted) {
            setUpcoming(upcoming)
            setPast(past)
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch /api/webinars', json)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching /api/webinars', err)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // fallback demo data when DB empty
  const defaultUpcoming: Webinar[] = [
    { id: '1', title: 'Stock Market Basics for Beginners', starts_at: '2026-04-15T19:00:00+05:30', duration_minutes: 90, platform: 'Zoom', price: 'Free', seats: 500 },
    { id: '2', title: 'Candlestick Patterns That Actually Work', starts_at: '2026-04-22T19:00:00+05:30', duration_minutes: 120, platform: 'Google Meet', price: '₹299', seats: 300 },
    { id: '3', title: 'Risk Management Strategies', starts_at: '2026-05-05T18:30:00+05:30', duration_minutes: 100, platform: 'Zoom', price: '₹499', seats: 400 },
    { id: '4', title: 'Live Trading Session: Real Market Analysis', starts_at: '2026-05-12T09:00:00+05:30', duration_minutes: 150, platform: 'Zoom', price: '₹799', seats: 200 },
  ]

  const defaultPast: Webinar[] = [
    { id: 'p1', title: 'Introduction to Options Trading', starts_at: '2026-01-08T19:00:00+05:30' },
    { id: 'p2', title: 'Market Psychology 101', starts_at: '2025-12-28T19:00:00+05:30' },
    { id: 'p3', title: 'Technical Analysis Deep Dive', starts_at: '2025-12-15T19:00:00+05:30' },
  ]
   console.log('Loaded webinars:', { upcomingWebinars, pastWebinars })
  const effectiveUpcoming = upcomingWebinars.length ? upcomingWebinars : defaultUpcoming
  const effectivePast = pastWebinars.length ? pastWebinars : defaultPast

  return (
    <>
      <Navigation />

      {/* HERO — EXPERIENCE FIRST */}
      <section className="relative py-28 bg-gradient-to-br from-primary to-accent overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto px-6 text-center"
        >
          <p className="uppercase tracking-widest text-primary-foreground/70 mb-4">
            Learn Live. Ask Questions. Grow Faster.
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary-foreground mb-6">
            Live Trading Webinars
          </h1>
          <p className="text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            Interactive sessions designed to give beginners real clarity — not recorded noise.
          </p>
        </motion.div>
      </section>

      {/* UPCOMING WEBINARS */}
      <section className="py-28 bg-background">
        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="max-w-7xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold mb-16"
          >
            Upcoming Sessions
          </motion.h2>

          {loading && <div>Loading webinars...</div>}

          <div className="mb-6 text-sm text-muted-foreground">
            Showing {effectiveUpcoming.length} upcoming webinar(s)
            <ul className="mt-2">
              {effectiveUpcoming.slice(0,5).map((w) => (
                <li key={w.id}>{w.title}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {effectiveUpcoming.map((w) => (
              <motion.div
                key={w.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="rounded-3xl bg-card shadow-md hover:shadow-2xl transition overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold leading-snug">
                    {w.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-5 text-sm">
                    <div className="flex gap-3">
                      <Calendar className="text-accent" />
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-semibold">{w.starts_at ? formatDateTime(w.starts_at) : '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="text-accent" />
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{w.duration_minutes ? `${w.duration_minutes} mins` : '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Video className="text-accent" />
                      <div>
                        <p className="text-muted-foreground">Platform</p>
                        <p className="font-semibold">{w.platform}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Users className="text-accent" />
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-semibold">{w.seats ?? '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-3xl font-extrabold text-primary">
                        {w.price}
                      </p>
                    </div>

                    <WebinarBookButton id={w.id} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PAYMENT — SOFT TRUST */}
      <section className="py-24 bg-muted">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl font-bold mb-10">
            Simple & Secure Payments
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["UPI", "Razorpay", "Paytm", "Cards"].map((method) => (
              <div
                key={method}
                className="rounded-2xl bg-background py-6 font-semibold shadow-sm"
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RECORDED SESSIONS */}
      <section className="py-28 bg-background">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold mb-16"
          >
            Past Sessions (Recorded)
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {pastWebinars.map((w) => (
              <motion.div
                key={w.id}
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                className="rounded-3xl bg-card shadow-md overflow-hidden"
              >
                <div className="h-44 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Video size={48} className="text-primary-foreground/70" />
                </div>

                <div className="p-8">
                  <h3 className="font-bold mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{w.starts_at ? formatDate(w.starts_at) : ''}</p>

                  <button className="w-full py-3 rounded-xl border border-primary
                    text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition">
                    Watch Recording
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}
