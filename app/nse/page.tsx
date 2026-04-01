"use client"

import { useRef, useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import { PremiumCard } from "@/components/ui/premium-card"
import { ChevronDown, ChevronUp, Sparkles, TrendingUp, Shield, Crown } from "lucide-react"

const playfair = Playfair_Display({ subsets: ["latin"] })

const nsePlans = [
  {
    id: "basic",
    title: "Basic",
    price: "₹5,000",
    badgeLabel: "Starter / Entry-Level Access",
    section: "foundational",
    icon: "📈",
    description: "Ideal for beginners who want to understand the fundamentals of stock market trading and build a strong foundation.",
    details: "Learn basics of stock market, risk management, and how to start trading with confidence.",
    features: [
      "Stock market fundamentals",
      "Demat & trading account setup",
      "Basic chart reading",
      "Risk awareness module",
      "Beginner trading checklist"
    ],
    forWhom: "Perfect for absolute beginners with zero trading experience.",
    duration: "4 Weeks",
    sessions: "8 Sessions"
  },
  {
    id: "standard",
    title: "Standard",
    price: "₹10,000",
    badgeLabel: "Core / Essential Tools & Guidance",
    section: "foundational",
    icon: "📊",
    description: "Covers essential trading strategies, tools, and practical insights to help you start trading with confidence.",
    details: "Includes technical analysis, tools, and structured approach for consistent trading.",
    features: [
      "Technical analysis basics",
      "Candlestick patterns",
      "Support & resistance levels",
      "Volume analysis",
      "Live market observation"
    ],
    forWhom: "For those who know basics and want structured strategy.",
    duration: "6 Weeks",
    sessions: "12 Sessions"
  },
  {
    id: "pro",
    title: "Pro",
    price: "₹50,000",
    badgeLabel: "Advanced / In-depth Strategies",
    section: "foundational",
    icon: "🔥",
    description: "Designed for serious learners who want advanced strategies, deeper market understanding, and real-world applications.",
    details: "Advanced price action, psychology, and real-world execution strategies.",
    features: [
      "Advanced price action",
      "Options & derivatives intro",
      "Trading psychology",
      "Live trade analysis",
      "Personal feedback sessions"
    ],
    forWhom: "For intermediate traders ready to go professional.",
    duration: "8 Weeks",
    sessions: "20 Sessions"
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹1,10,000",
    badgeLabel: "✨ Most Popular • Elite Mentorship",
    section: "advanced",
    icon: "⭐",
    description: "Includes personalized mentorship, live sessions, and direct guidance to accelerate your trading journey.",
    details: "Direct mentorship, live trading, and priority support.",
    features: [
      "1-on-1 mentorship sessions",
      "Live trading with Shobha Pujari",
      "Custom trading plan",
      "Priority WhatsApp support",
      "Monthly portfolio review"
    ],
    forWhom: "For serious traders who want personalized expert guidance.",
    duration: "3 Months",
    sessions: "Unlimited"
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "₹5,00,000",
    badgeLabel: "Professional / High-Volume Traders",
    section: "advanced",
    icon: "🏛️",
    description: "Built for professional traders looking for high-level strategies, capital management, and scaling techniques.",
    details: "Portfolio scaling, capital allocation, and advanced risk systems.",
    features: [
      "Institutional-level strategies",
      "Capital management system",
      "Advanced risk frameworks",
      "Algo trading introduction",
      "Dedicated support manager"
    ],
    forWhom: "For HNIs and professional traders managing large capital.",
    duration: "6 Months",
    sessions: "Unlimited + Priority"
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "₹10,00,000",
    badgeLabel: "👑 Lifetime / VIP Access",
    section: "advanced",
    icon: "💎",
    description: "Complete lifetime access with exclusive mentorship, priority support, and elite-level trading insights.",
    details: "All features unlocked + lifetime mentorship + VIP access.",
    features: [
      "Lifetime platform access",
      "All future programs included",
      "VIP community access",
      "Direct CA-level consultation",
      "Business & tax advisory"
    ],
    forWhom: "For those who want everything — forever.",
    duration: "Lifetime",
    sessions: "Unlimited Lifetime"
  }
]

const tabs = [
  { id: "foundational", label: "Foundational & Growth", icon: <TrendingUp size={16} /> },
  { id: "advanced", label: "Advanced & Elite", icon: <Crown size={16} /> }
]

const floatingStats = [
  { label: "Students Trained", value: "2,000+" },
  { label: "Success Rate", value: "94%" },
  { label: "Years Experience", value: "10+" },
  { label: "Live Sessions", value: "500+" }
]

export default function NSEPage() {
  const { isLight } = useTheme()
  const heroRef = useRef<HTMLElement>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"foundational" | "advanced">("foundational")
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggle = (id: string) => {
    setActiveCard(prev => (prev === id ? null : id))
  }

  const filteredPlans = nsePlans.filter(p => p.section === activeTab)

  const bg = isLight ? "#F7F2E8" : "#0F172A"
  const cardBg = isLight ? "#FFFFFF" : "#1A2847"
  const text = isLight ? "#3E3730" : "#E0E7FF"
  const accent = isLight ? "#D1AF62" : "#4FD1FF"
  const subtle = isLight ? "#EBE5D8" : "#243456"

  return (
    <main
      style={{ backgroundColor: bg, color: text } as React.CSSProperties}
      className="min-h-screen"
    >
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1" style={{ backgroundColor: subtle }}>
        <motion.div
          className="h-full"
          style={{ width: `${scrollProgress}%`, backgroundColor: accent }}
          transition={{ ease: "linear" }}
        />
      </div>

      <Navigation />



      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "radial-gradient(ellipse at 50% 0%, rgba(209,175,98,0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 0%, rgba(79,209,255,0.1) 0%, transparent 70%)"
            }}
          />
        </motion.div>


        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-[2]"
        >
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "radial-gradient(ellipse at 50% 0%, rgba(209,175,98,0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 0%, rgba(79,209,255,0.1) 0%, transparent 70%)"
            }}
          />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: subtle, color: accent }}
          >
            <Sparkles size={14} />
            National Stock Exchange Programs
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl md:text-6xl font-bold mb-6 ${playfair.className}`}
          >
            NSE Investment Programs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg opacity-70 mb-12"
          >
            Expert-led trading education by CA Shobha Pujari — choose your level and transform your financial future.
          </motion.p>

          {/* FLOATING STATS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
          >
            {floatingStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl px-4 py-4 text-center"
                style={{ backgroundColor: cardBg, border: `1px solid ${subtle}` }}
              >
                <div className="text-2xl font-bold" style={{ color: accent }}>{stat.value}</div>
                <div className="text-xs opacity-60 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TAB SWITCHER */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="flex justify-center mb-12">
          <div
            className="flex rounded-2xl p-1.5 gap-1"
            style={{ backgroundColor: subtle }}
          >
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setActiveCard(null)
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? cardBg : "transparent",
                  color: activeTab === tab.id ? accent : text,
                  boxShadow: activeTab === tab.id ? "0 2px 12px rgba(0,0,0,0.1)" : "none"
                }}
                whileTap={{ scale: 0.97 }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* CARDS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: activeCard && activeCard !== plan.id ? 0.5 : 1,
                  y: 0,
                  scale: activeCard === plan.id ? 1.02 : 1
                }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="cursor-pointer"
                onClick={() => handleToggle(plan.id)}
              >
                <PremiumCard
                  id={plan.id}
                  title={`${plan.icon}  ${plan.title}`}
                  description={plan.description}
                  badgeLabel={plan.badgeLabel}
                  price={plan.price}
                  priceLabel="Investment"
                  actionUrl="/contact"
                  actionLabel="Enroll Now"
                />

                {/* EXPANDABLE PANEL */}
                <AnimatePresence>
                  {activeCard === plan.id && (
                    <motion.div
                      key="expand"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 rounded-2xl p-5 text-sm space-y-4"
                        style={{ backgroundColor: cardBg, border: `1px solid ${subtle}` }}
                      >
                        {/* Who it's for */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
                            Who It's For
                          </p>
                          <p className="opacity-75">{plan.forWhom}</p>
                        </div>

                        {/* Features */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                            What's Included
                          </p>
                          <ul className="space-y-1.5">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-2 opacity-80">
                                <span style={{ color: accent }}>✓</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Duration + Sessions */}
                        <div className="flex gap-4">
                          <div
                            className="flex-1 rounded-xl px-3 py-2 text-center"
                            style={{ backgroundColor: subtle }}
                          >
                            <p className="text-xs opacity-60">Duration</p>
                            <p className="font-bold text-sm">{plan.duration}</p>
                          </div>
                          <div
                            className="flex-1 rounded-xl px-3 py-2 text-center"
                            style={{ backgroundColor: subtle }}
                          >
                            <p className="text-xs opacity-60">Sessions</p>
                            <p className="font-bold text-sm">{plan.sessions}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle label */}
                <div
                  className="flex items-center justify-center gap-1 mt-3 text-xs font-semibold"
                  style={{ color: accent }}
                >
                  {activeCard === plan.id
                    ? <><ChevronUp size={14} /> Show Less</>
                    : <><ChevronDown size={14} /> View Details</>
                  }
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto rounded-3xl p-10"
          style={{ backgroundColor: cardBg, border: `1px solid ${subtle}` }}
        >
          <div className="text-3xl mb-3">🎯</div>
          <h2 className={`text-3xl font-bold mb-3 ${playfair.className}`}>
            Not sure which plan fits you?
          </h2>
          <p className="opacity-60 mb-8">
            Talk to us and we'll guide you to the right program based on your goals and experience.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm"
            style={{ backgroundColor: accent, color: isLight ? "#fff" : "#0F172A" }}
          >
            <Shield size={16} />
            Contact Us for Guidance
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}