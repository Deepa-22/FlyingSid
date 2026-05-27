import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OPEN_POSITIONS, WHY_JOIN } from '../utils/constants'

const INPUT = 'w-full bg-surface border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm ' +
  'placeholder-gray-600 focus:outline-none focus:border-rose-500/60 transition-colors duration-300'

const TYPE_COLORS = {
  'Full-time': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Part-time':  'bg-amber-500/15  text-amber-400  border-amber-500/30',
  'Freelance':  'bg-rose-500/15   text-rose-400   border-rose-500/30',
}

const DEPT_LABEL = { tech: 'Tech', 'non-tech': 'Non-Tech' }

function ApplyModal({ position, onClose }) {
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const endpoint  = import.meta.env.VITE_FORMSPREE_ENDPOINT

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!endpoint) { alert('Formspree endpoint not configured.'); return }
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      })
      if (res.ok) setSent(true)
      else alert('Something went wrong — please try again.')
    } catch {
      alert('Could not send — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[95] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-2 border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] text-rose-400 tracking-widest uppercase mb-1">Apply Now</p>
                  <h3 className="font-display text-3xl text-white tracking-wider leading-tight">{position.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{position.location}</p>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none mt-1 ml-4">✕</button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <input type="hidden" name="position" value={position.title} />

                <div className="grid grid-cols-2 gap-4">
                  <input name="name"  required placeholder="Full Name"  className={INPUT} />
                  <input name="email" type="email" required placeholder="Email" className={INPUT} />
                </div>
                <input name="phone" placeholder="Phone Number" className={INPUT} />
                <input name="portfolio" placeholder="LinkedIn / Portfolio URL (optional)" className={INPUT} />
                <textarea
                  name="message" rows={4} required
                  placeholder="Why FlyingSid Flimz? Tell us about yourself and what you bring..."
                  className={INPUT + ' resize-none'}
                />

                {/* Resume note */}
                <div className="flex items-start gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3.5">
                  <svg className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    After submitting, please email your resume / portfolio to{' '}
                    <a href="mailto:hello@flyingsid.com" className="text-rose-400 hover:underline">hello@flyingsid.com</a>
                    {' '}with the subject <span className="text-white">"{position.title} — Application"</span>.
                  </p>
                </div>

                <motion.button
                  type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Submit Application'}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-3xl text-white tracking-wider mb-3">Application Sent!</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                We'll review your application and get back to you within 5 business days. Stay sharp.
              </p>
              <p className="text-xs text-gray-500 mb-8">
                Don't forget to email your resume to{' '}
                <a href="mailto:hello@flyingsid.com" className="text-rose-400 hover:underline">hello@flyingsid.com</a>
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={onClose} className="btn-primary px-6 py-2.5">
                  Back to Positions
                </button>
                <a href="#hero" onClick={onClose} className="btn-outline px-6 py-2.5">
                  Home
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Hiring() {
  const [filter,   setFilter]   = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [applying, setApplying] = useState(null)

  const filtered     = OPEN_POSITIONS.filter(p => filter === 'all' || p.department === filter)
  const techCount    = OPEN_POSITIONS.filter(p => p.department === 'tech').length
  const nonTechCount = OPEN_POSITIONS.filter(p => p.department === 'non-tech').length

  const handleFilter = (val) => { setFilter(val); setExpanded(null) }

  return (
    <section id="hiring" className="py-28 md:py-40 bg-surface">
      <div className="section-container">

        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          We're Hiring
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-5"
        >
          Join the Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-gray-400 text-center max-w-xl mx-auto mb-14 leading-relaxed"
        >
          We're a small, obsessed crew building something no one else is. If you want to work on the edge of cinema and technology, you're in the right place.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-14"
        >
          {[
            { value: OPEN_POSITIONS.length, label: 'Open Positions' },
            { value: techCount,             label: 'Tech Roles' },
            { value: nonTechCount,          label: 'Non-Tech Roles' },
          ].map(({ value, label }) => (
            <div key={label} className="glass-panel p-5 text-center">
              <p className="font-display text-4xl text-rose-400 leading-none mb-1">{value}</p>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-10">
          {[['all', 'All Roles'], ['tech', 'Tech'], ['non-tech', 'Non-Tech']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => handleFilter(val)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                filter === val
                  ? 'bg-rose-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.4)]'
                  : 'border border-white/15 text-gray-400 hover:border-rose-500/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="max-w-3xl mx-auto space-y-3 mb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map((pos, i) => (
              <motion.div
                key={pos.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="glass-panel overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === pos.id ? null : pos.id)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border tracking-widest uppercase ${TYPE_COLORS[pos.type]}`}>
                        {pos.type}
                      </span>
                      <span className="text-[10px] text-gray-600 tracking-widest uppercase">
                        {DEPT_LABEL[pos.department]}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-white tracking-wider">{pos.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{pos.location}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === pos.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Expanded body */}
                <AnimatePresence initial={false}>
                  {expanded === pos.id && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-7 border-t border-white/8 pt-5 space-y-5">
                        <p className="text-gray-300 text-sm leading-relaxed">{pos.desc}</p>

                        <div>
                          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">What we're looking for</p>
                          <ul className="space-y-2">
                            {pos.requirements.map((req, j) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => setApplying(pos)}
                          className="btn-primary"
                        >
                          Apply for this Role →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Why join us */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-5xl text-white tracking-wider text-center mb-12"
        >
          Why FlyingSid Flimz?
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {WHY_JOIN.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel p-6"
            >
              <div className="w-8 h-px bg-rose-500 mb-5" />
              <h4 className="font-display text-xl text-white tracking-wider mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {applying && <ApplyModal position={applying} onClose={() => setApplying(null)} />}
      </AnimatePresence>
    </section>
  )
}
