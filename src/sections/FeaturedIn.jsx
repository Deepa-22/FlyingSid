import { motion } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS } from '../utils/constants'
import { driveImg } from '../utils/drive'

export default function FeaturedIn() {
  const { files, loading } = useDrive(DRIVE_FOLDERS.featured)
  const images = files.filter(f => f.mimeType?.startsWith('image'))

  if (!loading && images.length === 0) return null

  return (
    <section className="py-16 border-y border-white/5 bg-surface overflow-hidden">
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-subtitle mb-10"
        >
          As Seen In
        </motion.p>

        {loading ? (
          <div className="flex gap-8 justify-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-10 bg-surface-2 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-10">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ scale: 1.08 }}
                className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100
                           transition-all duration-400"
              >
                <img
                  src={driveImg(img.id)}
                  alt={img.name}
                  className="h-10 md:h-12 w-auto object-contain max-w-[140px]"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
