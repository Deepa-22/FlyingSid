import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'
import { driveImg } from '../utils/drive'

// ── Gear Lightbox ─────────────────────────────────────────────────────────────

function GearLightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const item = items[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] bg-black/97 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white tracking-wider transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gear
        </button>
        <span className="text-[11px] text-gray-600 tracking-widest">{index + 1} / {items.length}</span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 text-gray-500 hover:text-white transition-colors text-xl leading-none"
        >✕</button>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-16">
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-3 md:left-6 text-gray-500 hover:text-white text-5xl px-2 transition-colors z-10 select-none"
        >‹</button>

        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="max-w-4xl w-full h-full flex items-center justify-center"
          >
            <img
              src={driveImg(item.id)}
              alt={item.name}
              className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-3 md:right-6 text-gray-500 hover:text-white text-5xl px-2 transition-colors z-10 select-none"
        >›</button>
      </div>

      <div className="py-3 text-center border-t border-white/5 flex-shrink-0">
        <p className="text-[11px] text-gray-600 tracking-widest">{item.name.replace(/\.[^.]+$/, '')}</p>
      </div>
    </motion.div>
  )
}

// ── Gear Section ──────────────────────────────────────────────────────────────

export default function Gear() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.gear)
  const [lightboxIdx, setLightboxIdx]     = useState(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef(null)

  const items = files.filter(f => f.mimeType?.startsWith('image') || f.mimeType?.startsWith('video'))

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    updateArrows()
    return () => el.removeEventListener('scroll', updateArrows)
  }, [updateArrows, items.length])

  const scroll = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: 'smooth' })
  }, [])

  const handlePrev = useCallback(() =>
    setLightboxIdx(i => (i - 1 + items.length) % items.length), [items.length])
  const handleNext = useCallback(() =>
    setLightboxIdx(i => (i + 1) % items.length), [items.length])

  if (!loading && items.length === 0) return null

  return (
    <section id="gear" className="py-28 md:py-40 bg-surface overflow-hidden">

      {/* Header */}
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >Equipment</motion.p>

        <div className="flex items-end justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="section-title"
          >Gear We Fly</motion.h2>

          {!loading && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="hidden md:flex items-center gap-3"
            >
              <button
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                className={`w-11 h-11 rounded-full border flex items-center justify-center text-xl transition-all duration-200 ${
                  canScrollLeft
                    ? 'border-white/20 text-white hover:bg-white/8 hover:border-white/40'
                    : 'border-white/5 text-gray-700 cursor-not-allowed'
                }`}
              >‹</button>
              <button
                onClick={() => scroll(1)}
                disabled={!canScrollRight}
                className={`w-11 h-11 rounded-full border flex items-center justify-center text-xl transition-all duration-200 ${
                  canScrollRight
                    ? 'border-rose-500/60 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400'
                    : 'border-white/5 text-gray-700 cursor-not-allowed'
                }`}
              >›</button>
              <span className="text-[10px] text-gray-600 tracking-widest ml-1 uppercase">
                {items.length} items
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Carousel track */}
      {loading ? (
        <div className="flex gap-5 px-6 md:px-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 rounded-2xl bg-surface-2 animate-pulse"
              style={{ width: 'min(380px, 80vw)', height: '300px' }} />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none
                          bg-gradient-to-r from-surface to-transparent" />
          <div className="absolute right-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none
                          bg-gradient-to-l from-surface to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto px-6 md:px-16 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(i, 5) * 0.07, duration: 0.5 }}
                onClick={() => item.mimeType?.startsWith('image') && setLightboxIdx(i)}
                className={`flex-shrink-0 relative group rounded-2xl overflow-hidden
                            ring-1 ring-white/8 hover:ring-rose-500/50
                            transition-all duration-400 ${item.mimeType?.startsWith('image') ? 'cursor-zoom-in' : ''}`}
                style={{ width: 'min(360px, 78vw)', height: '300px' }}
              >
                {item.mimeType?.startsWith('image') ? (
                  <img
                    src={driveImg(item.id)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                )}

                {/* Gradient overlay — always visible at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Equipment name */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] text-rose-400 tracking-widest uppercase mb-1">Equipment</p>
                  <p className="font-display text-lg text-white leading-snug tracking-wide">
                    {item.name.replace(/\.[^.]+$/, '')}
                  </p>
                </div>

                {/* Zoom icon on hover */}
                {item.mimeType?.startsWith('image') && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile arrows */}
      {!loading && items.length > 0 && (
        <div className="flex justify-center gap-3 mt-5 md:hidden">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className={`px-5 py-2 rounded-full text-xs border tracking-widest transition-all ${
              canScrollLeft ? 'border-white/20 text-gray-300' : 'border-white/5 text-gray-700'
            }`}
          >← Prev</button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className={`px-5 py-2 rounded-full text-xs border tracking-widest transition-all ${
              canScrollRight ? 'border-rose-500/50 text-rose-400' : 'border-white/5 text-gray-700'
            }`}
          >Next →</button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <GearLightbox
            items={items}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
