import { useState } from 'react'
import { motion } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'

const WORDS = ['High-Speed', 'Precision', 'Aerial', 'Cinematography']

const SPECS_LEFT = [
  { label: 'Frame Rate',  value: '240 fps' },
  { label: 'Resolution',  value: '4K RAW' },
  { label: 'Sensor',      value: 'Sony IMX' },
]
const SPECS_RIGHT = [
  { label: 'Max Speed',   value: '150 km/h' },
  { label: 'FPV Range',   value: '10 km' },
  { label: 'Experience',  value: '5+ Years' },
]

function CornerBracket({ corner }) {
  const pos = {
    tl: 'top-8 left-8 md:top-14 md:left-14',
    tr: 'top-8 right-8 md:top-14 md:right-14 rotate-90',
    bl: 'bottom-20 left-8 md:bottom-24 md:left-14 -rotate-90',
    br: 'bottom-20 right-8 md:bottom-24 md:right-14 rotate-180',
  }[corner]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ delay: 2.0, duration: 0.6 }}
      className={`absolute ${pos} w-7 h-7 pointer-events-none`}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-rose-500" />
      <div className="absolute top-0 left-0 w-px h-full bg-rose-500" />
    </motion.div>
  )
}

export default function Hero() {
  const { files } = useDrive(DRIVE_FOLDERS.mainVideo)
  const [videoError, setVideoError] = useState(false)
  const video = files.find(f => f.mimeType?.startsWith('video'))

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">

      {/* Background */}
      {video && !videoError ? (
        <video
          autoPlay muted loop playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          src={`https://drive.google.com/uc?export=download&id=${video.id}`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
      )}

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-void" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent pointer-events-none"
        animate={{ top: ['10%', '90%', '10%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner viewfinder brackets */}
      {['tl', 'tr', 'bl', 'br'].map(c => <CornerBracket key={c} corner={c} />)}

      {/* Left spec panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.1, duration: 0.7 }}
        className="absolute left-8 md:left-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5"
      >
        {SPECS_LEFT.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[9px] text-gray-600 tracking-widest uppercase mb-0.5">{label}</p>
            <p className="text-[13px] text-gray-300 font-display tracking-widest">{value}</p>
            <div className="w-8 h-px bg-rose-500/40 mt-1" />
          </div>
        ))}
      </motion.div>

      {/* Right spec panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.1, duration: 0.7 }}
        className="absolute right-8 md:right-14 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 items-end"
      >
        {SPECS_RIGHT.map(({ label, value }) => (
          <div key={label} className="text-right">
            <p className="text-[9px] text-gray-600 tracking-widest uppercase mb-0.5">{label}</p>
            <p className="text-[13px] text-gray-300 font-display tracking-widest">{value}</p>
            <div className="w-8 h-px bg-rose-500/40 mt-1 ml-auto" />
          </div>
        ))}
      </motion.div>

      {/* Top status line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-[9px] text-gray-500 tracking-[0.3em] uppercase">Live Production Ready</span>
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
      </motion.div>

      {/* Main content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">

        {/* Brand headline */}
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.45, duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display text-[3.2rem] sm:text-[5rem] md:text-[7rem] lg:text-[9.5rem]
                         leading-none text-white select-none"
              style={{
                textShadow: '0 0 80px rgba(244,63,94,0.2), 0 0 160px rgba(244,63,94,0.08)',
              }}
            >
              FLYINGSID
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display text-[2rem] sm:text-[3.2rem] md:text-[4.5rem] lg:text-[6rem]
                         leading-none text-rose-500 select-none tracking-[0.15em]"
            >
              FLIMZ
            </motion.div>
          </div>
        </div>

        {/* Staggered subtitle words */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 mb-8">
          {WORDS.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                initial={{ y: 36, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.85 + i * 0.09, duration: 0.55, ease: 'easeOut' }}
                className="block font-display text-xl sm:text-3xl md:text-4xl text-gray-300 tracking-widest"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed"
        >
          Films. Commercials. Extreme sports. We put the camera where no one else can.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => document.querySelector('#showreels')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Watch Showreels
          </button>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline"
          >
            Get a Quote
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-gray-500 hover:text-rose-400 transition-colors duration-300"
      >
        <span className="text-[9px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-rose-500 to-transparent"
        />
      </motion.button>
    </section>
  )
}
