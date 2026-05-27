import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../utils/constants'

function smoothScroll(href) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-void/90 backdrop-blur-md border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => smoothScroll('#hero')}
            className="flex items-center gap-3 group"
          >
            <img
              src="/LOGO.jpg"
              alt="Flying Sid"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20
                         group-hover:ring-rose-500 transition-all duration-300"
            />
            <span className="font-display text-xl tracking-widest hidden sm:block">
              FLYING SID
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <button
                  onClick={() => smoothScroll(link.href)}
                  className="relative text-[10px] text-gray-400 hover:text-white
                             tracking-widest uppercase transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-500
                                   group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
                className="block w-6 h-px bg-white origin-center transition-colors"
              />
              <motion.span
                animate={{ opacity: open ? 0 : 1 }}
                className="block w-6 h-px bg-white"
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
                className="block w-6 h-px bg-white origin-center"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-void/97 backdrop-blur-xl
                       flex flex-col items-center justify-center gap-7"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { smoothScroll(link.href); setOpen(false) }}
                className="font-display text-5xl text-white tracking-widest
                           hover:text-rose-400 transition-colors duration-200"
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
