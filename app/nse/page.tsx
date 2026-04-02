"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTheme } from "@/hooks/useTheme"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

import { Playfair_Display } from "next/font/google"
const playfair = Playfair_Display({ subsets: ["latin"] })
import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"

const nsePlans = [
  {
    id: "basic",
    title: "Basic",
    price: "₹5,000",
    badgeLabel: "Starter / Entry-Level Access",
    description: "Ideal for beginners who want to understand the fundamentals of stock market trading and build a strong foundation.",
  },
  {
    id: "standard",
    title: "Standard",
    price: "₹10,000",
    badgeLabel: "Core / Essential Tools & Guidance",
    description: "Covers essential trading strategies, tools, and practical insights to help you start trading with confidence.",
  },
  {
    id: "pro",
    title: "Pro",
    price: "₹50,000",
    badgeLabel: "Advanced / In-depth Strategies",
    description: "Designed for serious learners who want advanced strategies, deeper market understanding, and real-world applications.",
  },
  {
    id: "premium",
    title: "Premium",
    price: "₹110,000",
    badgeLabel: "✨ Most Popular • Elite",
    description: "Includes personalized mentorship, live sessions, and direct guidance to accelerate your trading journey.",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "₹500,000",
    badgeLabel: "Professional / High-Volume Traders",
    description: "Built for professional traders looking for high-level strategies, capital management, and scaling techniques.",
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "₹1,000,000",
    badgeLabel: "Lifetime / VIP Access",
    description: "Complete lifetime access with exclusive mentorship, priority support, and elite-level trading insights.",
  }
]

export default function NSEPage() {
  const { isLight } = useTheme()

  return (
    <main
      style={{
        '--fin-bg-primary': isLight ? '#F7F2E8' : '#0F172A',
        '--fin-bg-secondary': isLight ? '#EBE5D8' : '#1A2847',
        '--fin-bg-accent': isLight ? '#DFD8CC' : '#243456',
        '--fin-gradient-hero': isLight ? 'linear-gradient(90deg, #FBF8F2 0%, #F7F2E8 50%, #F5F0E6 100%)' : 'linear-gradient(90deg, #0F172A 0%, #1A2847 50%, #243456 100%)',
        '--fin-text-primary': isLight ? '#3E3730' : '#E0E7FF',
        '--fin-text-secondary': isLight ? '#645E56' : '#C7D2FE',
        '--fin-text-light': isLight ? '#8A847C' : '#A5B4FC',
        '--fin-accent-gold': isLight ? '#D1AF62' : '#4FD1FF',
        '--fin-accent-soft-gold': isLight ? '#A38970' : '#3B82F6',
        '--fin-border-light': isLight ? '#A38970' : '#4FD1FF',
        '--fin-border-divider': isLight ? '#D6CCBE' : '#334155'
      } as React.CSSProperties}
      className={`${isLight ? 'bg-white text-[var(--fin-text-primary)]' : 'bg-[#0F172A] text-[#E0E7FF]'} min-h-screen transition-colors duration-500 font-sans`}
    >
      <Navigation />

      {/* HERO — PREMIUM FINTECH REDESIGN */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
        <video
          src={isLight ? '/nseday.mp4' : '/nsenight.mp4'}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* dark translucent overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-4xl mx-auto px-6 z-10"
          style={{ marginTop: '100px' }}
        >
          {/* Premium Octagon Card Container with Overlapping Images */}
          <div className="relative md:min-h-[180px]">
            {/* Main Card with Octagon Shape - Clean, Single Layer */}
            <motion.div
              variants={premiumFadeUp}
              className="relative w-full md:min-h-[180px] overflow-visible z-20"
              style={{ 
                background: 'transparent',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                borderRadius: '60px',
                border: isLight ? '3px double #D4A574' : '3px double #4FD1FF',
                boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)' : '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                backdropFilter: 'blur(2px)'
              }}
            >
              {/* Grid Layout: Center Text Only */}
              <div className="flex items-center justify-center relative z-20">
                
                {/* CENTER: Text Content */}
                <motion.div 
                  variants={premiumStagger}
                  className="px-12 md:px-16 py-6 md:py-8 text-center flex flex-col justify-start relative z-40"
                >
                  <motion.p
                    variants={premiumFadeUp}
                    className="uppercase tracking-[0.15em] mb-2 font-semibold text-sm md:text-base"
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Growth • Mastery • Excellence
                  </motion.p>

                  <motion.h1
                    variants={premiumFadeUp}
                    className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 ${playfair.className} tracking-tight leading-tight`}
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    NSE Investment Programs
                  </motion.h1>

                  <motion.p
                    variants={premiumFadeUp}
                    className="text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4"
                    style={{
                      color: isLight ? '#D1AF62' : '#4FD1FF',
                      textShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.6)'
                    }}
                  >
                    Choose the right level of trading education and mentorship designed for your growth.
                  </motion.p>

                  {/* Button Half-Box Container */}
                  <motion.div 
                    variants={premiumFadeUp}
                    className="mt-6 -mx-12 md:-mx-16 pt-6 border-t-2 border-b-2"
                    style={{
                      borderColor: isLight ? '#D4A574' : '#4FD1FF',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <div className="px-12 md:px-16 pb-6">
                      <motion.p
                        variants={premiumFadeUp}
                        className="text-base md:text-lg font-semibold mb-4 text-center"
                        style={{
                          color: isLight ? '#D1AF62' : '#4FD1FF'
                        }}
                      >
                        Explore our
                      </motion.p>

                      {/* PREMIUM GRADIENT BUTTONS */}
                      <motion.div 
                        variants={premiumFadeUp}
                        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                      >
                        <motion.a
                          href="#plans"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
                          }}
                          onHoverEnd={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-base md:text-lg transition-all duration-300 cursor-pointer"
                          style={{
                            background: isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)',
                            border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(79, 209, 255, 0.3)',
                            color: '#ffffff',
                            boxShadow: isLight ? '0 4px 12px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" clipRule="evenodd" /></svg>
                          Foundational & Growth Programs
                        </motion.a>
                        <motion.a
                          href="#contact"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)';
                          }}
                          onHoverEnd={(e) => {
                            (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-base md:text-lg transition-all duration-300 cursor-pointer"
                          style={{
                            background: isLight ? 'linear-gradient(135deg, #d4af37, #c69c2d)' : 'linear-gradient(135deg, #4FD1FF, #3B82F6)',
                            border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(79, 209, 255, 0.3)',
                            color: '#ffffff',
                            boxShadow: isLight ? '0 4px 12px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(79, 209, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                          Advanced & Elite Programs
                        </motion.a>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PLANS GRID */}
      <section id="plans" className="py-24 relative border-b border-[var(--fin-border-divider)]" style={{ background: isLight ? 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.03), transparent 60%), linear-gradient(180deg, #f8f5f0 0%, #efe6da 100%)' : '#0F172A' }}>
        {/* SECTION 1: Foundational & Growth Programs */}
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6 mb-24"
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Foundational & Growth Programs
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {nsePlans.slice(0, 3).map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.04, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                {/* Liquid Glass Wrapper */}
                <div
                  className="relative rounded-2xl border border-[#D4AF37]/40 overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]/80 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]"
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                    boxShadow: isLight ? '0 8px 32px 0 rgba(31, 38, 135, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Subtle inner glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: isLight ? 'radial-gradient(ellipse at top-left, rgba(212,175,55,0.1), transparent 60%)' : 'radial-gradient(ellipse at top-left, rgba(79,209,255,0.05), transparent 60%)'
                    }}
                  />

                  {/* Light reflection streak */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      background: isLight ? 'linear-gradient(90deg, transparent, #D4AF37, transparent)' : 'linear-gradient(90deg, transparent, #4FD1FF, transparent)'
                    }}
                  />

                  <PremiumCard
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    description={plan.description}
                    badgeLabel={plan.badgeLabel}
                    price={plan.price}
                    priceLabel="Investment"
                    actionUrl={`/contact`}
                    actionLabel="Enroll Now"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 2: Advanced & Elite Programs */}
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-12">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Advanced & Elite Programs
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {nsePlans.slice(3, 6).map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.04, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                {/* Liquid Glass Wrapper */}
                <div
                  className="relative rounded-2xl border border-[#D4AF37]/40 overflow-hidden transition-all duration-500 group-hover:border-[#D4AF37]/80 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]"
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                    boxShadow: isLight ? '0 8px 32px 0 rgba(31, 38, 135, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Subtle inner glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: isLight ? 'radial-gradient(ellipse at top-left, rgba(212,175,55,0.1), transparent 60%)' : 'radial-gradient(ellipse at top-left, rgba(79,209,255,0.05), transparent 60%)'
                    }}
                  />

                  {/* Light reflection streak */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      background: isLight ? 'linear-gradient(90deg, transparent, #D4AF37, transparent)' : 'linear-gradient(90deg, transparent, #4FD1FF, transparent)'
                    }}
                  />

                  <PremiumCard
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    description={plan.description}
                    badgeLabel={plan.badgeLabel}
                    price={plan.price}
                    priceLabel="Investment"
                    actionUrl={`/contact`}
                    actionLabel="Enroll Now"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-32 relative overflow-hidden border-t border-[var(--fin-border-light)]" style={{ backgroundColor: isLight ? '#FFFFFF' : '#0F172A' }}>
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
            Not sure which plan to choose?
          </motion.h2>
          <motion.p
            variants={premiumFadeUp}
            className="text-xl text-[var(--fin-text-primary)]/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Reach out to our team to find the perfect fit for your trading goals and experience level.
          </motion.p>

          <motion.div variants={premiumFadeUp}>
            <Link
              href="/contact"
              style={{
                backgroundColor: isLight ? '#3E3730' : '#4FD1FF',
                color: isLight ? 'white' : '#0F172A'
              }}
              className="group/cta inline-flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_20px_40px_-10px_rgba(79,209,255,0.3)] hover:-translate-y-1.5 border border-transparent relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Contact us for guidance</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
