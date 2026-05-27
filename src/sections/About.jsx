import { motion } from 'framer-motion'
import useDrive from '../hooks/useDrive'
import { DRIVE_FOLDERS, STATS } from '../utils/constants'
import { driveImg } from '../utils/drive'

const fadeUp = {
  hidden:   { opacity: 0, y: 36 },
  visible:  (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.13, duration: 0.7, ease: 'easeOut' },
  }),
}

export default function About() {
  const { files } = useDrive(DRIVE_FOLDERS.about)
  const image = files.find(f => f.mimeType?.startsWith('image'))

  return (
    <section id="about" className="py-28 md:py-40">
      <div className="section-container">

        {/* Section header */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          The Pilot
        </motion.p>
        <motion.h2
          variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="section-title mb-20"
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface">
              {image ? (
                <img
                  src={driveImg(image.id)}
                  alt="Flying Sid pilot"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface to-void
                                flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-full h-full
                            border border-rose-500/25 rounded-2xl -z-10" />
          </motion.div>

          {/* Bio */}
          <div>
            <motion.p
              variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-gray-200 text-lg leading-relaxed mb-5"
            >
              I'm Sid — an FPV pilot and cinematographer obsessed with pushing the limits of
              aerial storytelling. What started as a hobby evolved into a full-scale production
              discipline: custom-built race drones, cinema-grade camera rigs, and a relentless
              pursuit of the perfect frame.
            </motion.p>
            <motion.p
              variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-gray-400 leading-relaxed mb-12"
            >
              From chasing athletes at 150 km/h to threading industrial structures millimetres
              from the hull — every flight is engineered. Every shot is intentional. The drone
              is just the tool; the story is everything.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8
                         border-t border-white/8"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-4xl text-rose-400 leading-none mb-1">{value}</p>
                  <p className="text-[10px] text-gray-500 tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
