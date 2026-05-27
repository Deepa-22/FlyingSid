import { motion } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'
import { driveImg } from '../utils/drive'

export default function FeaturedIn() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.featured)
  const images = files.filter(f => f.mimeType?.startsWith('image'))

  if (!loading && images.length === 0) return null

  // Duplicate for seamless infinite scroll
  const track = [...images, ...images, ...images]

  return (
    <section className="py-16 border-y border-white/5 bg-surface overflow-hidden">
      <div className="section-container mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-subtitle"
        >
          As Seen In
        </motion.p>
      </div>

      {loading ? (
        <div className="flex gap-6 justify-center px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-20 bg-surface-2 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                          bg-gradient-to-r from-surface to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none
                          bg-gradient-to-l from-surface to-transparent" />

          {/* Marquee track */}
          <div
            className="flex gap-6"
            style={{
              animation: `marquee ${images.length * 4}s linear infinite`,
              width: 'max-content',
            }}
          >
            {track.map((img, i) => (
              <div
                key={`${img.id}-${i}`}
                className="flex-shrink-0 group relative rounded-xl overflow-hidden
                           ring-1 ring-white/8 hover:ring-rose-500/40 transition-all duration-300"
                style={{ width: '220px', height: '160px' }}
              >
                <img
                  src={driveImg(img.id)}
                  alt={img.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0
                             opacity-60 group-hover:opacity-100 transition-all duration-400
                             scale-100 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
