import { motion } from 'framer-motion'
import { SERVICES } from '../utils/constants'

const ICONS = {
  fpv: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  commercial: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  sports: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  events: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  realestate: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  film: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
}

export default function Services() {
  return (
    <section id="services" className="py-28 md:py-40">
      <div className="section-container">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-4"
        >
          Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-sm text-center max-w-xl mx-auto mb-16"
        >
          Every project is custom-quoted. Tell me what you need and we'll figure out the rest.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="glass-panel p-7 group cursor-default hover:border-rose-500/30
                         transition-all duration-400"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center
                              text-rose-400 mb-5 group-hover:bg-rose-500/20 transition-colors duration-300">
                {ICONS[svc.id]}
              </div>
              <h3 className="font-display text-2xl text-white tracking-wider mb-3">
                {svc.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-14"
        >
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Discuss Your Project
          </button>
        </motion.div>
      </div>
    </section>
  )
}
