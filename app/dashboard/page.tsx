'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { motion, AnimatePresence } from 'framer-motion'
import { premiumFadeUp, premiumStagger, premiumEasing, microPop } from '@/lib/animations'
import {
  Calendar,
  Clock,
  Video,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Radio,
  Download,
  ExternalLink,
  Bell,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Layers,
  Star,
  User as UserIcon,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type WebinarBooking = {
  id: string
  tier_name: string
  price: number
  currency: string
  booking_status: string
  created_at: string
  starts_at: string | null
  duration_minutes: number | null
  platform: string
  description: string
  meeting_details?: { scheduled_date?: string; scheduled_time?: string; duration?: string }
}

type NSEBooking = {
  id: string
  tier_name: string
  price: number
  currency: string
  booking_status: string
  created_at: string
  description?: string
  duration?: string
  sessions?: string
  category?: string
  badge_label?: string
}

type CourseBooking = {
  id: string
  tier_name: string
  price: number
  currency: string
  booking_status: string
  created_at: string
  description?: string
  duration?: string
  level?: string
  modules?: number
}

type DashboardData = {
  webinars: WebinarBooking[]
  nse: NSEBooking[]
  courses: CourseBooking[]
  total: number
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(targetDateStr: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number; status: 'upcoming' | 'live' | 'ended' } | null>(null)

  useEffect(() => {
    if (!targetDateStr) { setTimeLeft(null); return }

    const update = () => {
      const target = new Date(targetDateStr).getTime()
      const now = Date.now()
      const diff = target - now

      if (diff <= 0 && diff >= -7200000) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, status: 'live' })
      } else if (diff < -7200000) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, status: 'ended' })
      } else {
        const days = Math.floor(diff / 86400000)
        const hours = Math.floor((diff % 86400000) / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeLeft({ days, hours, mins, secs, status: 'upcoming' })
      }
    }

    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [targetDateStr])

  return timeLeft
}

// ─── ICS Calendar Download ────────────────────────────────────────────────────
function downloadICS(title: string, startStr: string | null, durationMins: number | null, description: string) {
  if (!startStr) return
  const start = new Date(startStr)
  const end = new Date(start.getTime() + (durationMins || 60) * 60000)

  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CASobha//Dashboard//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@cashobha.in`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')} | Check your email for the join link 1 hour before.`,
    'ORGANIZER;CN=Shobha Pujari:mailto:info@cashobha.in',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/\s+/g, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, isLight }: { status: 'upcoming' | 'live' | 'ended' | 'confirmed'; isLight: boolean }) {
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
      <Radio size={10} className="animate-ping" /> Live Now
    </span>
  )
  if (status === 'upcoming') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: isLight ? '#EBF5FF' : '#1E3A5F', color: isLight ? '#1A7FE8' : '#60B4FF', border: `1px solid ${isLight ? '#BFDBFE' : '#1E40AF'}` }}>
      <Clock size={10} /> Upcoming
    </span>
  )
  if (status === 'ended') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: isLight ? '#F0FDF4' : '#14532D30', color: isLight ? '#16A34A' : '#4ADE80', border: `1px solid ${isLight ? '#BBF7D0' : '#15803D'}` }}>
      <CheckCircle2 size={10} /> Completed
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: isLight ? '#FFF7ED' : '#7C2D1230', color: isLight ? '#EA580C' : '#FB923C', border: `1px solid ${isLight ? '#FED7AA' : '#C2410C'}` }}>
      <AlertCircle size={10} /> {status}
    </span>
  )
}

// ─── Countdown Display ────────────────────────────────────────────────────────
function CountdownDisplay({ startsAt, isLight }: { startsAt: string | null; isLight: boolean }) {
  const cd = useCountdown(startsAt)
  if (!startsAt || !cd) return null

  if (cd.status === 'live') return (
    <div className="flex items-center gap-2 mt-4">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
      <span className="text-sm font-bold text-emerald-400 tracking-tight">Happening right now!</span>
    </div>
  )
  if (cd.status === 'ended') return (
    <div className="flex items-center gap-2 mt-4 opacity-70">
      <CheckCircle2 size={14} className="text-emerald-500" />
      <span className="text-sm font-medium" style={{ color: isLight ? '#6B7280' : '#94A3B8' }}>Session completed</span>
    </div>
  )

  return (
    <div className="mt-4">
      <p className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-50" style={{ color: isLight ? '#A38970' : '#94A3B8' }}>Starts in</p>
      <div className="flex items-center gap-2">
        {[{ val: cd.days, label: 'Days' }, { val: cd.hours, label: 'Hrs' }, { val: cd.mins, label: 'Min' }, { val: cd.secs, label: 'Sec' }].map(({ val, label }) => (
          <div key={label} className="text-center group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold tabular-nums transition-all group-hover:scale-105 group-hover:translate-y-[-2px]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A', color: isLight ? '#3E3730' : '#60B4FF', border: `1px solid ${isLight ? '#E0D5C7' : '#334155'}`, boxShadow: isLight ? '0 4px 6px -1px rgb(0 0 0 / 0.05)' : 'none' }}>
              {String(val).padStart(2, '0')}
            </div>
            <div className="text-[10px] mt-1 font-semibold uppercase tracking-tighter" style={{ color: isLight ? '#A38970' : '#64748B' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Webinar Card ─────────────────────────────────────────────────────────────
function WebinarCard({ booking, isLight }: { booking: WebinarBooking; isLight: boolean }) {
  const cd = useCountdown(booking.starts_at)
  const status = cd?.status ?? 'upcoming'

  const formattedDate = booking.starts_at
    ? new Date(booking.starts_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    : booking.meeting_details?.scheduled_date || 'TBA'

  const formattedTime = booking.starts_at
    ? new Date(booking.starts_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : booking.meeting_details?.scheduled_time || ''

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="group rounded-[2rem] p-6 border transition-all duration-500 overflow-hidden relative" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.08)', boxShadow: isLight ? '0 10px 25px -5px rgba(209, 175, 98, 0.1)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
      <div className="absolute -top-12 -right-12 w-32 h-32 blur-[60px] rounded-full transition-opacity opacity-0 group-hover:opacity-100" style={{ backgroundColor: isLight ? '#D1AF6220' : '#3B82F630' }} />
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl transition-colors group-hover:scale-110 duration-300" style={{ backgroundColor: isLight ? '#EFF6FF' : '#1E3A5F' }}>
              <Video size={16} className="text-blue-500" />
            </div>
            <StatusBadge status={status} isLight={isLight} />
          </div>
          <h3 className="font-extrabold text-lg leading-tight transition-colors" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{booking.tier_name}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-black text-lg tracking-tight" style={{ color: isLight ? '#D1AF62' : '#60B4FF' }}>{booking.price > 0 ? `₹${booking.price.toLocaleString()}` : 'Free'}</div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70" style={{ color: isLight ? '#A38970' : '#64748B' }}>Paid</p>
        </div>
      </div>
      {booking.description && <p className="text-sm leading-relaxed mb-4 line-clamp-2 opacity-90" style={{ color: isLight ? '#6B7280' : '#94A3B8' }}>{booking.description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 rounded-2xl" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A' }}>
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: isLight ? '#A38970' : '#94A3B8' }}><Calendar size={14} className="text-blue-500/50" /> <span className="truncate">{formattedDate}</span></div>
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: isLight ? '#A38970' : '#94A3B8' }}><Clock size={14} className="text-blue-500/50" /> <span>{formattedTime || (booking.duration_minutes ? `${booking.duration_minutes} min` : 'TBA')}</span></div>
        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: isLight ? '#A38970' : '#94A3B8' }}><Video size={14} className="text-blue-500/50" /> <span className="truncate">{booking.platform || 'Zoom Meeting'}</span></div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500"><CheckCircle2 size={14} /> <span>Confirmed</span></div>
      </div>
      <CountdownDisplay startsAt={booking.starts_at} isLight={isLight} />
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {status === 'live' ? (
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95" style={{ backgroundColor: '#10B981', color: '#fff' }} onClick={() => window.open('#', '_blank')}><ExternalLink size={18} /> Join Now</button>
        ) : status === 'upcoming' ? (
          <button onClick={() => downloadICS(booking.tier_name, booking.starts_at, booking.duration_minutes, booking.description)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border group-hover:scale-[1.02] active:scale-95" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A', color: isLight ? '#3E3730' : '#94A3B8', borderColor: isLight ? '#E0D5C7' : '#334155' }}><Download size={18} /> Add to Calendar</button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all opacity-50 cursor-not-allowed" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A', color: isLight ? '#A38970' : '#64748B', border: `1px solid ${isLight ? '#E0D5C7' : '#334155'}` }} disabled><CheckCircle2 size={18} /> Event Completed</button>
        )}
      </div>
      {(status === 'upcoming' || status === 'live') && (
        <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl border border-dashed" style={{ backgroundColor: isLight ? '#FFFBEB' : '#1C1808', borderColor: isLight ? '#FDE68A' : '#78350F', color: isLight ? '#92400E' : '#FCD34D' }}>
          <Bell size={14} className="mt-0.5 flex-shrink-0 animate-bounce" />
          <p className="text-[10px] font-bold uppercase leading-tight">Link Sent via Email 1 hour before start</p>
        </div>
      )}
    </motion.div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, isLight }: { label: string; value: number; icon: React.ReactNode; color: string; isLight: boolean }) {
  return (
    <motion.div variants={microPop} className="rounded-[2rem] p-5 border group transition-all duration-500 overflow-hidden relative" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.06)', boxShadow: isLight ? '0 4px 6px -1px rgb(0 0 0 / 0.05)' : 'none' }}>
      <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${color}05, transparent)` }} />
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
          {icon}
        </div>
        <div className="text-left">
          <div className="text-2xl font-black transition-transform group-hover:scale-110 origin-left" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{value}</div>
          <div className="text-[10px] uppercase font-black tracking-widest opacity-70" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

function PlusIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { isLight } = useTheme()
  const router = useRouter()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'webinars' | 'nse' | 'courses'>('webinars')

  const displayName = (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.fullName || (user as any)?.email?.split('@')[0] || 'Student'
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)

  const loadDashboard = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/my-dashboard?userId=${user.id}`)
      if (!res.ok) throw new Error('Failed to load dashboard')
      const json = await res.json()
      setData(json)
      if (json.webinars?.length > 0) setActiveTab('webinars')
      else if (json.nse?.length > 0) setActiveTab('nse')
      else if (json.courses?.length > 0) setActiveTab('courses')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) loadDashboard()
  }, [user, loadDashboard])

  const upcomingWebinarsCount = data?.webinars.filter(w => w.starts_at && new Date(w.starts_at).getTime() > Date.now() - 7200000).length ?? 0
  const completedCount = data?.total ? data.total - upcomingWebinarsCount : 0

  const stats = [
    { label: 'Courses', value: data?.courses.length ?? 0, icon: <BookOpen />, color: '#10B981' },
    { label: 'Webinars', value: upcomingWebinarsCount, icon: <Radio />, color: '#3B82F6' },
    { label: 'NSE', value: data?.nse.length ?? 0, icon: <TrendingUp />, color: '#F97316' },
    { label: 'Completed', value: completedCount, icon: <CheckCircle2 />, color: '#D1AF62' },
  ]

  if (authLoading || (user && loading && !data)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0A1128' }}>
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-16 h-16 border-4 border-t-transparent rounded-full mb-6" style={{ borderColor: isLight ? '#D1AF62' : '#3B82F6', borderTopColor: 'transparent' }} />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 animate-pulse" style={{ color: isLight ? '#D1AF62' : '#3B82F6' }} />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Personalizing Your Hub</h2>
        <p className="text-sm font-medium opacity-60" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Just a moment while we fetch your learning journey...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-28 pb-32 relative transition-colors duration-500 overflow-hidden" style={{ backgroundColor: isLight ? '#F7F2E8' : '#0A1128' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: isLight ? '#D1AF62' : '#3B82F6' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] blur-[120px] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: isLight ? '#60A5FA' : '#1D4ED8' }} />

        <motion.div variants={premiumStagger} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-5 relative z-10">
          <motion.div variants={premiumFadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute -inset-1 blur-lg bg-gradient-to-tr from-[#D1AF62] to-[#3B82F6] rounded-full opacity-50 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black border-4 shadow-xl overflow-hidden" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#D1AF6220' : '#3B82F620', color: isLight ? '#3E3730' : '#F1F5F9' }}>{userInitials}</div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 flex items-center justify-center shadow-lg" style={{ borderColor: isLight ? '#F7F2E8' : '#0A1128' }}><CheckCircle2 size={12} className="text-white" /></div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-black tracking-tighter" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>My Hub</h1>
                  <Sparkles size={20} className="text-[#D1AF62]" />
                </div>
                <p className="text-base font-bold opacity-70" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Welcome, {displayName}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{data?.total ?? 0} Enrollments</span>
                </div>
              </div>
            </div>
            <button onClick={() => router.push('/contact')} className="group flex items-center gap-3 px-6 py-4 rounded-[2rem] border-2 font-black text-sm uppercase tracking-widest transition-all hover:bg-white hover:shadow-xl active:scale-95" style={{ borderColor: isLight ? '#D1AF6240' : '#3B82F640', backgroundColor: isLight ? '#FFFFFF60' : '#1E293B60', color: isLight ? '#3E3730' : '#F1F5F9' }}><MessageSquare size={20} className="transition-transform group-hover:-rotate-12 group-hover:scale-110" /> Support</button>
          </motion.div>

          <motion.div variants={premiumFadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {stats.map(stat => <StatCard key={stat.label} {...stat} isLight={isLight} />)}
          </motion.div>

          <motion.div variants={premiumFadeUp} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="inline-flex p-1.5 rounded-[2.5rem] border backdrop-blur-xl relative" style={{ backgroundColor: isLight ? '#FFFFFF80' : '#1E293B80', borderColor: isLight ? '#E0D5C760' : 'rgba(255,255,255,0.06)' }}>
              {[{ id: 'webinars', label: 'Webinars', icon: <Video />, count: data?.webinars.length ?? 0 }, { id: 'nse', label: 'NSE', icon: <TrendingUp />, count: data?.nse.length ?? 0 }, { id: 'courses', label: 'Courses', icon: <BookOpen />, count: data?.courses.length ?? 0 }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`relative flex items-center gap-3 px-7 py-3.5 rounded-[2rem] text-sm font-black uppercase tracking-wider transition-all duration-500 ${activeTab === tab.id ? 'text-white' : ''}`} style={{ color: activeTab === tab.id ? '#fff' : (isLight ? '#3E373080' : '#F1F5F980') }}>
                  {activeTab === tab.id && <motion.div layoutId="active-tab" className="absolute inset-0 rounded-[2rem] shadow-lg shadow-blue-500/20" style={{ backgroundColor: isLight ? '#D1AF62' : '#3B82F6' }} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-10">{tab.icon}</span><span className="relative z-10">{tab.label}</span><span className="relative z-10 text-[10px] opacity-60 font-black">{tab.count}</span>
                </button>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-70 px-4" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Showing {activeTab === 'webinars' ? 'Live & Upcoming' : activeTab === 'nse' ? 'NSE Programs & Courses' : 'Self-Paced Learning'}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
              {activeTab === 'webinars' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data?.webinars.length === 0 ? (
                    <div className="col-span-full py-24 text-center rounded-[3rem] border-2 border-dashed" style={{ borderColor: isLight ? '#D1AF6240' : '#3B82F640', backgroundColor: isLight ? '#FFFFFF40' : '#1E293B40' }}>
                      <Video size={48} className="mx-auto mb-6 opacity-20" /><h3 className="text-2xl font-black mb-3" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>No Webinars Found</h3><button onClick={() => router.push('/webinars')} className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95">Browse Webinars <ArrowRight size={18} className="inline ml-2" /></button>
                    </div>
                  ) : data?.webinars.map(b => <WebinarCard key={b.id} booking={b} isLight={isLight} />)}
                </div>
              )}
              {activeTab === 'nse' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.nse.length === 0 ? (
                    <div className="col-span-full py-24 text-center">No NSE programs enroled.</div>
                  ) : data?.nse.map(b => (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key={b.id} className="group rounded-[2rem] p-6 border transition-all duration-500" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.08)' }}>
                      <div className="p-3 w-fit rounded-2xl mb-4" style={{ backgroundColor: isLight ? '#FFF7ED' : '#431407' }}><TrendingUp size={20} className="text-orange-500" /></div>
                      <h3 className="font-extrabold text-lg mb-2" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{b.tier_name}</h3>
                      <p className="text-xs font-bold leading-relaxed opacity-80 mb-6" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{b.description || 'Professional financial program'}</p>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-90"><span className="flex items-center gap-1.5"><Clock size={12} /> {b.duration || 'Flexible'}</span> <span className="flex items-center gap-1.5"><Layers size={12} /> {b.sessions || '4'} Sessions</span></div>
                      <button onClick={() => router.push('/nse')} className="w-full mt-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-orange-500 hover:text-white border-2" style={{ borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.08)', color: isLight ? '#3E3730' : '#F1F5F9' }}>Visit Program <ChevronRight size={14} className="inline ml-1" /></button>
                    </motion.div>
                  ))}
                  <motion.div variants={premiumFadeUp} className="rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-[#D1AF6205]" style={{ borderColor: isLight ? '#D1AF6240' : '#3B82F620' }}>
                    <PlusIcon size={32} className="opacity-40 mb-4" /><h4 className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Add More</h4><button onClick={() => router.push('/nse')} className="text-xs font-black uppercase tracking-tighter hover:underline" style={{ color: isLight ? '#D1AF62' : '#60B4FF' }}>Browse NSE</button>
                  </motion.div>
                </div>
              )}
              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.courses.length === 0 ? (
                    <div className="col-span-full py-24 text-center">No self-paced courses enroled.</div>
                  ) : data?.courses.map(b => (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key={b.id} className="group rounded-[2rem] p-6 border transition-all duration-500" style={{ backgroundColor: isLight ? '#FFFFFF' : '#1E293B', borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.08)' }}>
                      <div className="p-3 w-fit rounded-2xl mb-4" style={{ backgroundColor: isLight ? '#F0FDF4' : '#14532D' }}><BookOpen size={20} className="text-emerald-500" /></div>
                      <h3 className="font-extrabold text-lg mb-2" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>{b.tier_name}</h3>
                      <p className="text-xs font-bold leading-relaxed opacity-60 mb-6" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Master the markets at your own pace.</p>
                      <button onClick={() => router.push('/courses')} className="w-full mt-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-emerald-500 hover:text-white border-2" style={{ borderColor: isLight ? '#E0D5C7' : 'rgba(255,255,255,0.08)', color: isLight ? '#3E3730' : '#F1F5F9' }}>Start Learning <ChevronRight size={14} className="inline ml-1" /></button>
                    </motion.div>
                  ))}
                  <motion.div variants={premiumFadeUp} className="rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-[#D1AF6205]" style={{ borderColor: isLight ? '#D1AF6240' : '#3B82F620' }}>
                    <PlusIcon size={32} className="opacity-20 mb-4" /><h4 className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: isLight ? '#3E3730' : '#F1F5F9' }}>Add More</h4><button onClick={() => router.push('/courses')} className="text-xs font-black uppercase tracking-tighter hover:underline" style={{ color: isLight ? '#D1AF62' : '#60B4FF' }}>Browse Courses</button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
      <Footer />
    </>
  )
}
