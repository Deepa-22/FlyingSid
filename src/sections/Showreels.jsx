import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'
import { driveThumb } from '../utils/drive'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-video bg-surface-2 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

export default function Showreels() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.showreels)
  const videos = files.filter(f => f.mimeType?.startsWith('video'))
  const [active, setActive] = useState(0)

  return (
    <section id="showreels" className="py-28 md:py-40 bg-surface">
      <div className="section-container">

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          Best Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-14"
        >
          Showreels
        </motion.h2>

        {loading && <SkeletonGrid />}

        {!loading && videos.length === 0 && (
          <p className="text-center text-gray-600 py-20 text-sm tracking-wider">
            No showreels found — add videos to the Showreels Drive folder.
          </p>
        )}

        {!loading && videos.length > 0 && (
          <>
            {/* Featured player */}
            <AnimatePresence mode="wait">
              <motion.div
                key={videos[active]?.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]
                           aspect-video bg-black mb-6"
              >
                {/* Desktop: inline iframe embed */}
                <iframe
                  src={`https://drive.google.com/file/d/${videos[active].id}/preview`}
                  className="hidden sm:block w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={videos[active].name}
                />

                {/* Mobile: thumbnail + tap to open */}
                <div className="sm:hidden relative w-full h-full">
                  <img
                    src={driveThumb(videos[active].id, 640)}
                    alt={videos[active].name}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={`https://drive.google.com/file/d/${videos[active].id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3
                               bg-black/40"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                                    flex items-center justify-center">
                      <span className="text-white text-3xl ml-1">▶</span>
                    </div>
                    <span className="text-white/80 text-xs tracking-widest uppercase">Tap to play</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail strip */}
            {videos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {videos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActive(i)}
                    className={`flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden
                               border-2 transition-all duration-300 ${
                                 i === active
                                   ? 'border-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.4)]'
                                   : 'border-white/10 hover:border-white/30'
                               }`}
                  >
                    <img
                      src={driveThumb(v.id)}
                      alt={v.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                    <div className="w-full h-full bg-surface-2 items-center justify-center hidden">
                      <span className="font-display text-2xl text-gray-600">{i + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
