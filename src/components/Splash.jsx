import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BRAND = 'FLYING SID FLIMZ'.split('')

export default function Splash({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
        >
          {/* Logo */}
          <motion.img
            src="/LOGO.jpg"
            alt="Flying Sid"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-14 h-14 rounded-full object-cover ring-1 ring-white/20 mb-8"
          />

          {/* Letter-by-letter brand name */}
          <div className="flex overflow-hidden">
            {BRAND.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 56, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.35 + i * 0.045,
                  duration: 0.55,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className={`font-display text-[1.6rem] sm:text-5xl md:text-7xl text-white ${char === ' ' ? 'w-3 sm:w-5 md:w-7' : ''}`}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-3 text-xs text-gray-500 tracking-widest3 uppercase"
          >
            FPV Cinematics
          </motion.p>

          {/* Progress bar */}
          <div className="mt-10 w-36 h-px bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-rose-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.8, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
