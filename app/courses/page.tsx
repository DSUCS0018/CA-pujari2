"use client"

import { useEffect, useState, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Clock, Users, ArrowRight, Book } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import supabase from "@/lib/supabaseClient"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

// --- Premium Animation System ---
const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1]

const premiumStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // intentional, luxury pacing
      delayChildren: 0.1,
    }
  }
}

const premiumFadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: premiumEasing }
  }
}

const microPop = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: premiumEasing } 
  }
}

type Course = {
  id: string
  title: string
  description?: string
  duration?: string
  level?: string
  modules?: number
  price?: string
  students_count?: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  
  // For Parallax Effect
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/courses')
        const json = await res.json()
        if (res.ok) {
          if (mounted) setCourses((json.data as Course[]) ?? [])
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch /api/courses', json)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching /api/courses', err)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // fallback to original hardcoded demo data when DB returns empty
  const defaultCourses: Course[] = [
    {
      id: '1',
      title: 'Trading Fundamentals',
      description: 'Learn the foundations of stock market trading with clarity and confidence.',
      duration: '4 weeks',
      students_count: 2500,
      price: '₹4,999',
      level: 'Beginner',
      modules: 12,
    },
    {
      id: '2',
      title: 'Technical Analysis Mastery',
      description: 'Read charts like a professional using proven technical frameworks.',
      duration: '6 weeks',
      students_count: 1800,
      price: '₹7,999',
      level: 'Beginner',
      modules: 18,
    },
    {
      id: '3',
      title: 'Risk Management & Position Sizing',
      description: 'Protect your capital and trade with discipline, not emotion.',
      duration: '3 weeks',
      students_count: 1200,
      price: '₹3,999',
      level: 'Beginner',
      modules: 8,
    },
    {
      id: '4',
      title: 'Market Psychology',
      description: 'Understand fear, greed, and mindset — the real edge in trading.',
      duration: '4 weeks',
      students_count: 950,
      price: '₹5,999',
      level: 'Beginner',
      modules: 10,
    },
    {
      id: '5',
      title: 'Day Trading Strategies',
      description: 'Intraday frameworks designed for real-time market conditions.',
      duration: '5 weeks',
      students_count: 1400,
      price: '₹6,999',
      level: 'Beginner',
      modules: 15,
    },
    {
      id: '6',
      title: 'Option Trading Basics',
      description: 'Understand options without confusion — calls, puts, and basics.',
      duration: '6 weeks',
      students_count: 850,
      price: '₹8,999',
      level: 'Beginner',
      modules: 16,
    },
  ]

  const effectiveCourses = courses.length ? courses : defaultCourses

  return (
    <main
      style={{
        '--fin-bg-primary': '#F7F2E8',
        '--fin-bg-secondary': '#EBE5D8',
        '--fin-bg-accent': '#DFD8CC',
        '--fin-gradient-hero': 'linear-gradient(90deg, #FBF8F2 0%, #F7F2E8 50%, #F5F0E6 100%)',
        '--fin-text-primary': '#3E3730',
        '--fin-text-secondary': '#645E56',
        '--fin-text-light': '#8A847C',
        '--fin-accent-gold': '#D1AF62',
        '--fin-accent-soft-gold': '#A38970',
        '--fin-border-light': '#A38970',
        '--fin-border-divider': '#D6CCBE'
      } as React.CSSProperties}
      className="bg-white min-h-screen text-[var(--fin-text-primary)] transition-colors duration-500 font-sans"
    >
      <Navigation />

      {/* HERO — PREMIUM FINANCE */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000"
      >
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, background: 'var(--fin-gradient-hero)' }}
          className="absolute inset-0 z-0 will-change-transform"
        />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.p 
            variants={premiumFadeUp}
            className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm"
          >
            Structured • Beginner-First • Practical
          </motion.p>
          <motion.h1 
            variants={premiumFadeUp}
            className={`text-5xl md:text-7xl font-extrabold text-[var(--fin-text-primary)] mb-8 ${playfair.className} tracking-tight leading-tight`}
          >
            Trading Courses
          </motion.h1>
          <motion.p 
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            Master the markets step-by-step with discipline, clarity, and confidence. Our curriculum is designed for serious traders.
          </motion.p>
        </motion.div>
      </section>

      {/* COURSES GRID */}
      <section className="py-24 bg-white relative">
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-4xl md:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Choose Your Learning Path
            </motion.h2>
            <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
              Showing {effectiveCourses.length} carefully crafted modules designed to build a solid foundation.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)] font-medium">Loading premium courses...</div>}
            {!loading && effectiveCourses.length === 0 && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)]">No courses available.</div>}
            
            {effectiveCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={premiumFadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.5, ease: premiumEasing }}
                className="group relative flex flex-col rounded-2xl bg-[var(--fin-bg-primary)] border border-[var(--fin-border-light)] shadow-sm hover:border-[var(--fin-accent-gold)]/40 hover:shadow-[0_30px_60px_-15px_rgba(62,55,48,0.15)] overflow-hidden transition-all duration-500 will-change-transform"
              >
                {/* Subtle internal atmospheric glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                {/* Clean top accent bar */}
                <div className="h-2 w-full bg-[var(--fin-border-divider)] group-hover:bg-[var(--fin-accent-gold)] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                
                <div className="p-8 md:p-10 flex flex-col h-full bg-white relative z-10 transition-colors duration-500 group-hover:bg-transparent">
                  {/* LEVEL TAG */}
                  <motion.span 
                    variants={premiumStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider
                    rounded-full bg-[var(--fin-bg-secondary)]/50 text-[var(--fin-text-primary)] w-fit border border-[var(--fin-border-light)] shadow-sm"
                  >
                    {course.level}
                  </motion.span>

                  {/* TITLE */}
                  <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-[var(--fin-text-primary)] leading-snug ${playfair.className}`}>
                    {course.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-[var(--fin-text-secondary)] mb-8 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* META */}
                  <motion.div 
                    variants={premiumStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-4 text-sm text-[var(--fin-text-secondary)] mb-10 font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div variants={microPop}><Clock size={16} className="text-[var(--fin-accent-gold)]" /></motion.div>
                      <motion.span variants={premiumFadeUp}>{course.duration}</motion.span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.div variants={microPop}><Book size={16} className="text-[var(--fin-accent-gold)]" /></motion.div>
                      <motion.span variants={premiumFadeUp}>{course.modules ?? 0} modules</motion.span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.div variants={microPop}><Users size={16} className="text-[var(--fin-accent-gold)]" /></motion.div>
                      <motion.span variants={premiumFadeUp}>{course.students_count ?? 0} active learners</motion.span>
                    </div>
                  </motion.div>

                  {/* FOOTER */}
                  <motion.div 
                    variants={premiumStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-auto pt-8 border-t border-[var(--fin-border-light)] group-hover:border-[var(--fin-accent-gold)]/20 transition-colors duration-500 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[var(--fin-text-light)] mb-1 font-semibold">Investment</p>
                      <motion.p variants={premiumFadeUp} className="text-2xl font-bold text-[var(--fin-text-primary)]">
                        {course.price}
                      </motion.p>
                    </div>

                    <Link
                      href={`/signup?course=${course.id}`}
                      className="group/btn px-6 py-3 bg-white border border-[var(--fin-border-light)] text-[var(--fin-text-primary)]
                      rounded-xl font-semibold flex items-center gap-2
                      hover:bg-[var(--fin-accent-gold)] hover:border-[var(--fin-accent-gold)] hover:text-white transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-md hover:-translate-y-1"
                    >
                      Enroll Now
                      <ArrowRight
                        size={16}
                        className="transform group-hover/btn:translate-x-1.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-[var(--fin-accent-gold)] group-hover/btn:text-white"
                      />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA — PREMIUM FINANCE */}
      <section className="py-32 bg-white relative overflow-hidden border-t border-[var(--fin-border-light)]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--fin-accent-gold)]/40 to-transparent" />
        
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h2 
            variants={premiumFadeUp}
            className={`text-4xl md:text-5xl font-extrabold mb-6 text-[var(--fin-text-primary)] ${playfair.className}`}
          >
            Not Sure Where to Start?
          </motion.h2>
          <motion.p 
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-primary)]/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Begin with the fundamentals and build a resilient investment framework over time. Excellence requires process.
          </motion.p>

          <motion.div variants={premiumFadeUp}>
            <Link
              href="/webinars"
              className="group/cta inline-flex items-center justify-center px-10 py-5 bg-[var(--fin-text-primary)] text-white
              rounded-xl font-bold text-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#2A2420] hover:shadow-[0_20px_40px_-10px_rgba(209,175,98,0.3)] hover:-translate-y-1.5 border border-transparent hover:border-[var(--fin-accent-gold)]/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Join an Introductory Webinar</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
