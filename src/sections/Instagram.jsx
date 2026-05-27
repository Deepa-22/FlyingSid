import { motion } from 'framer-motion'
import { SITE_CONFIG } from '../utils/constants'

const IGIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const YTIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const SOCIALS = [
  {
    icon: <IGIcon />,
    label: 'Instagram',
    handle: '@flyingsid09',
    sub: 'Behind the scenes & showreels',
    href: SITE_CONFIG.instagram,
    color: 'from-rose-500/20 to-pink-600/10',
    border: 'border-rose-500/30 hover:border-rose-500/70',
    btn: 'bg-rose-500 hover:bg-rose-400',
    cta: 'Follow on Instagram',
  },
  {
    icon: <YTIcon />,
    label: 'YouTube',
    handle: 'FlyingSid Flimz',
    sub: 'Full films & featured work',
    href: SITE_CONFIG.youtube,
    color: 'from-red-600/20 to-orange-700/10',
    border: 'border-red-500/30 hover:border-red-500/70',
    btn: 'bg-red-600 hover:bg-red-500',
    cta: 'Watch on YouTube',
  },
]

export default function Instagram() {
  return (
    <section id="instagram" className="py-28 md:py-40 bg-surface overflow-hidden">
      <div className="section-container">

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          Follow Along
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-16"
        >
          Stay Connected
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {SOCIALS.map(({ icon, label, handle, sub, href, color, border, btn, cta }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative rounded-2xl border ${border} bg-gradient-to-br ${color}
                          backdrop-blur-sm p-8 flex flex-col gap-5 transition-all duration-300
                          group overflow-hidden`}
            >
              {/* Glow blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full
                              bg-white/3 blur-2xl pointer-events-none
                              group-hover:bg-white/6 transition-all duration-500" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center text-white">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">{label}</p>
                  <p className="font-display text-xl text-white tracking-wider">{handle}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">{sub}</p>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 self-start ${btn}
                            text-white text-xs font-bold tracking-widest uppercase
                            px-5 py-2.5 rounded-full transition-all duration-200
                            hover:shadow-lg hover:scale-105`}
              >
                {cta}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
