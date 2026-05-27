import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS, STATS } from '../utils/constants'
import { driveImg } from '../utils/drive'

// ── Animated counter ──────────────────────────────────────────────────────────

function Counter({ value }) {
  const num    = parseInt(value)
  const suffix = value.replace(/^\d+/, '')
  const [count, setCount]   = useState(0)
  const nodeRef = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      const duration = 1800
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.round(eased * num))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [num])

  return <span ref={nodeRef}>{count}{suffix}</span>
}

// ── HUD corner bracket ────────────────────────────────────────────────────────

function Bracket({ corner }) {
  const cls = {
    tl: 'top-4 left-4',
    tr: 'top-4 right-4 rotate-90',
    bl: 'bottom-[72px] left-4 -rotate-90',
    br: 'bottom-[72px] right-4 rotate-180',
  }[corner]
  return (
    <div className={`absolute ${cls} w-5 h-5 pointer-events-none`}>
      <div className="absolute top-0 left-0 w-full h-px bg-rose-500/50" />
      <div className="absolute top-0 left-0 w-px h-full bg-rose-500/50" />
    </div>
  )
}

// ── About Section ─────────────────────────────────────────────────────────────

export default function About() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.about)
  const images = files.filter(f => f.mimeType?.startsWith('image'))
  const [activeIdx, setActiveIdx] = useState(0)

  const prev = useCallback(() =>
    setActiveIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() =>
    setActiveIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, images.length])

  const active = images[activeIdx]

  return (
    <section id="about" className="py-28 md:py-40 overflow-hidden">
      <div className="section-container">

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >The Pilot</motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-16"
        >About Me</motion.h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: image carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            {/* Main image frame */}
            <div className="relative aspect-[3/4] max-h-[75vh] rounded-2xl overflow-hidden bg-surface ring-1 ring-white/10">

              {loading && <div className="w-full h-full bg-surface-2 animate-pulse" />}

              <AnimatePresence mode="wait">
                {active ? (
                  <motion.img
                    key={active.id}
                    src={driveImg(active.id)}
                    alt="Flying Sid pilot"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.55 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : !loading && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-surface to-void
                               flex items-center justify-center"
                  >
                    <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gradient + HUD overlays — non-interactive */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              {['tl','tr','bl','br'].map(c => <Bracket key={c} corner={c} />)}

              {/* Camera meta */}
              <div className="absolute bottom-4 left-5 pointer-events-none">
                <p className="text-[9px] text-rose-400/80 tracking-widest uppercase font-mono">
                  Sony FX3 · 4K RAW · 24fps
                </p>
                {images.length > 1 && (
                  <p className="text-[9px] text-gray-600 tracking-widest font-mono mt-0.5">
                    {String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </p>
                )}
              </div>

              {/* Dot progress — interactive */}
              {images.length > 1 && (
                <div className="absolute bottom-5 right-5 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === activeIdx ? 'w-5 bg-rose-500' : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-black/40 backdrop-blur-sm border border-white/10
                               flex items-center justify-center text-white/70 hover:text-white
                               hover:bg-black/60 transition-all text-xl"
                  >‹</button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                               bg-black/40 backdrop-blur-sm border border-white/10
                               flex items-center justify-center text-white/70 hover:text-white
                               hover:bg-black/60 transition-all text-xl"
                  >›</button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div
                className="flex gap-2 mt-3 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden ring-2
                                transition-all duration-200 ${
                                  i === activeIdx
                                    ? 'ring-rose-500 opacity-100'
                                    : 'ring-transparent opacity-35 hover:opacity-70'
                                }`}
                  >
                    <img src={driveImg(img.id)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Accent line */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rose-500/50 to-transparent" />
              <span className="text-[9px] text-rose-500/50 tracking-[0.3em] uppercase font-mono">FlyingSid Flimz</span>
            </div>
          </motion.div>

          {/* ── Right: bio + stats ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.15 }}
          >
            {/* Opening quote */}
            <div className="text-7xl text-rose-500/15 font-display leading-none mb-2 select-none">"</div>

            <p className="text-gray-200 text-lg leading-relaxed mb-5">
              I'm Sid — an FPV pilot and cinematographer obsessed with pushing the limits of
              aerial storytelling. What started as a hobby evolved into a full-scale production
              discipline: custom-built race drones, cinema-grade camera rigs, and a relentless
              pursuit of the perfect frame.
            </p>
            <p className="text-gray-400 leading-relaxed mb-12">
              From chasing athletes at 150 km/h to threading industrial structures millimetres
              from the hull — every flight is engineered. Every shot is intentional. The drone
              is just the tool; the story is everything.
            </p>

            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/8">
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                >
                  <p className="font-display text-4xl text-rose-400 leading-none mb-1">
                    <Counter value={value} />
                  </p>
                  <p className="text-[10px] text-gray-500 tracking-widest uppercase">{label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-10"
            >
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Work With Me
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
