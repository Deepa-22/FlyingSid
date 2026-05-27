import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'
import { driveImg, driveThumb } from '../utils/drive'

// ── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ media, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const file = media[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] bg-black/97 flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white tracking-wider transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </button>
        <span className="text-[11px] text-gray-600 tracking-widest">
          {index + 1} / {media.length}
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 text-gray-500 hover:text-white transition-colors text-xl leading-none"
        >✕</button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-16">
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-3 md:left-6 text-gray-500 hover:text-white text-5xl px-2 transition-colors z-10 select-none"
        >‹</button>

        <AnimatePresence mode="wait">
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="max-w-5xl w-full h-full flex items-center justify-center"
          >
            {file.mimeType?.startsWith('image') ? (
              <img
                src={driveImg(file.id)}
                alt={file.name}
                className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={`https://drive.google.com/file/d/${file.id}/preview`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-3 md:right-6 text-gray-500 hover:text-white text-5xl px-2 transition-colors z-10 select-none"
        >›</button>
      </div>

      {/* Caption */}
      <div className="py-3 text-center text-[11px] text-gray-600 tracking-widest border-t border-white/5 flex-shrink-0">
        {file.name.replace(/\.[^.]+$/, '')}
      </div>
    </motion.div>
  )
}

// ── Gallery Section ───────────────────────────────────────────────────────────

export default function Gallery() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.images)
  const [lightboxIdx, setLightboxIdx]     = useState(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef(null)

  const media = files.filter(f =>
    f.mimeType?.startsWith('image') || f.mimeType?.startsWith('video')
  )

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
  }, [updateArrows, media.length])

  const scroll = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: 'smooth' })
  }, [])

  const handlePrev = useCallback(() =>
    setLightboxIdx(i => (i - 1 + media.length) % media.length), [media.length])
  const handleNext = useCallback(() =>
    setLightboxIdx(i => (i + 1) % media.length), [media.length])

  return (
    <section id="gallery" className="py-28 md:py-40 overflow-hidden">

      {/* Header */}
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >Portfolio</motion.p>

        <div className="flex items-end justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="section-title"
          >Client Gallery</motion.h2>

          {!loading && media.length > 0 && (
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
                {media.length} shots
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Track */}
      {loading ? (
        <div className="flex gap-4 px-6 md:px-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-52 rounded-2xl bg-surface animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="section-container">
          <p className="text-gray-700 text-sm tracking-wider text-center py-16">
            Add images to your Drive images folder to populate this gallery.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none
                          bg-gradient-to-r from-void to-transparent" />
          <div className="absolute right-0 top-0 bottom-4 w-16 md:w-28 z-10 pointer-events-none
                          bg-gradient-to-l from-void to-transparent" />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-6 md:px-16 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {media.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
                onClick={() => setLightboxIdx(i)}
                className="flex-shrink-0 relative group cursor-zoom-in rounded-2xl overflow-hidden
                           ring-1 ring-white/5 hover:ring-rose-500/40 transition-all duration-300"
                style={{ width: 'min(300px, 72vw)', height: '220px' }}
              >
                {file.mimeType?.startsWith('image') ? (
                  <img
                    src={driveImg(file.id)}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative w-full h-full bg-surface-2">
                    <img
                      src={driveThumb(file.id)}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <p className="text-[11px] text-white/80 tracking-wide truncate">
                      {file.name.replace(/\.[^.]+$/, '')}
                    </p>
                  </div>
                </div>

                {/* Index badge */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm
                                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-white/70">{i + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile arrows */}
      {!loading && media.length > 0 && (
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
          <Lightbox
            media={media}
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
