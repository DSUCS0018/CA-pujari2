"use client"

import { useRef } from "react"
import { useTheme } from "@/hooks/useTheme"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const IMAGES = [
  {
    src: "/bento gallery/8.png",
    label: "Why Most Traders Stay Stuck",
  },
  {
    src: "/bento gallery/9.png",
    label: "Two Types of Traders",
  },
  {
    src: "/bento gallery/7.png",
    label: "NSE Programs",
  },
  {
    src: "/bento gallery/10.png",
    label: "Why Live Webinars Matter",
  },
  {
    src: "/bento gallery/11.png",
    label: "Why Business Strategy Consultation Matters",
  },
]

// Each cell slides in from a unique direction
// direction: [x%, y%] — how far off-screen it starts
const cellDirections = [
  { x: "-100%", y: "0%" },  // large left cell  → slides from left
  { x: "100%", y: "-100%" }, // top-right        → slides from top-right
  { x: "100%", y: "100%" }, // mid-right        → slides from bottom-right
  { x: "0%", y: "100%" }, // bottom-left      → slides from bottom
  { x: "0%", y: "100%" }, // bottom-right     → slides from bottom
]

export function BentoGallery() {
  const { isLight } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth out the scroll progress with a slightly more "relaxed" spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 35,
    restDelta: 0.001
  })

  // Phase 1 (0–0.30): headline
  const textOpacity = useTransform(smoothProgress, [0, 0.05, 0.22, 0.30], [0, 1, 1, 0])
  const textY = useTransform(smoothProgress, [0, 0.05], [20, 0])

  // Phase 2 (0.25–0.75): images flying in (More relaxed timing)
  const img0X = useTransform(smoothProgress, [0.25, 0.55], ["-100%", "0%"])
  const img1X = useTransform(smoothProgress, [0.27, 0.58], ["100%", "0%"])
  const img1Y = useTransform(smoothProgress, [0.27, 0.58], ["-100%", "0%"])
  const img2X = useTransform(smoothProgress, [0.29, 0.61], ["100%", "0%"])
  const img2Y = useTransform(smoothProgress, [0.29, 0.61], ["100%", "0%"])
  const img3Y = useTransform(smoothProgress, [0.31, 0.64], ["100%", "0%"])
  const img4Y = useTransform(smoothProgress, [0.33, 0.67], ["100%", "0%"])

  // Removed opacity transforms — keeping 100% opacity throughout

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A' }}
      >

        {/* ── Phase 1: Headline ── */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <p className="uppercase tracking-[0.25em] text-xs font-bold text-[#D1AF62] mb-5">
            Your Trading Education Partner
          </p>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-3xl" style={{ color: isLight ? '#3E3730' : '#E0E7FF' }}>
            Master The Markets
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg font-medium leading-relaxed" style={{ color: isLight ? '#A38970' : '#CBD5E1' }}>
            Dive deep into technical analysis, risk management, and trading
            psychology. See the unseen with our advanced market charting frameworks.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 pointer-events-auto">
            <Link
              href="/courses"
              className="px-8 py-4 bg-[#D1AF62] text-white rounded-full font-bold text-base hover:bg-[#C09E51] hover:shadow-[0_0_24px_rgba(209,175,98,0.45)] transition-all duration-300 hover:scale-105"
            >
              Start Learning
            </Link>
            <Link
              href="/courses"
              className="px-8 py-4 font-bold text-base rounded-full transition-colors"
              style={{
                color: isLight ? '#3E3730' : '#E0E7FF',
                borderWidth: '1px',
                borderColor: isLight ? '#A38970/30' : '#4FD1FF/30',
                backgroundColor: isLight ? '#F7F2E8' : '#1E293B'
              }}
            >
              View Curriculum
            </Link>
          </div>
        </motion.div>

        {/* ── Phase 2: Full-screen bento — images fly in from their own directions ── */}
        <div className="absolute inset-0 z-10 w-screen h-screen grid gap-[3px]"
          style={{ backgroundColor: isLight ? '#F7F2E8' : '#0F172A', gridTemplateColumns: '3fr 2fr', gridTemplateRows: '1fr 1fr' }}>

          {/* Top-left  ← from left */}
          <motion.div
            style={{ x: img0X }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm will-change-transform"
          >
            <Image 
              src={IMAGES[0].src} 
              alt={IMAGES[0].label} 
              fill 
              priority
              className="object-cover object-top" 
            />
          </motion.div>

          {/* Top-right  ↙ from top-right corner */}
          <motion.div
            style={{ x: img1X, y: img1Y }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-sm will-change-transform"
          >
            <Image 
              src={IMAGES[1].src} 
              alt={IMAGES[1].label} 
              fill 
              priority
              className="object-cover object-top" 
            />
          </motion.div>

          {/* Bottom Row — spans full width, 3 equal columns */}
          <div className="col-span-2 grid grid-cols-3 gap-[3px]">
            {/* Bottom-left  ↖ from bottom-right corner */}
            <motion.div
              style={{ x: img2X, y: img2Y }}
              className="relative overflow-hidden bg-white/5 backdrop-blur-sm will-change-transform"
            >
              <Image 
                src={IMAGES[2].src} 
                alt={IMAGES[2].label} 
                fill 
                priority
                className="object-cover object-top" 
              />
            </motion.div>

            {/* Bottom-center  ↑ from bottom */}
            <motion.div
              style={{ y: img3Y }}
              className="relative overflow-hidden bg-white/5 backdrop-blur-sm will-change-transform"
            >
              <Image 
                src={IMAGES[3].src} 
                alt={IMAGES[3].label} 
                fill 
                priority
                className="object-cover object-top" 
              />
            </motion.div>

            {/* Bottom-right  ↑ from bottom */}
            <motion.div
              style={{ y: img4Y }}
              className="relative overflow-hidden bg-white/5 backdrop-blur-sm will-change-transform"
            >
              <Image 
                src={IMAGES[4].src} 
                alt={IMAGES[4].label} 
                fill 
                priority
                className="object-cover object-top" 
              />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}
