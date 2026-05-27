import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_CONFIG, PROJECT_TYPES } from '../utils/constants'

const INPUT =
  'w-full bg-surface border border-white/10 rounded-xl px-5 py-4 text-white text-sm ' +
  'placeholder-gray-600 focus:outline-none focus:border-rose-500/60 transition-colors duration-300'

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IGIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

export default function Contact() {
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || ''

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!endpoint) {
      alert('Set VITE_FORMSPREE_ENDPOINT in your .env file.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
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
    <section id="contact" className="py-28 md:py-40">
      <div className="section-container">

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          Let's Create
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-16"
        >
          Contact
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 max-w-5xl mx-auto">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-4xl text-white tracking-wider mb-5">
              Ready to fly?
            </h3>
            <p className="text-gray-400 leading-relaxed mb-10">
              Tell me about your project. Whether it's a feature film, a commercial brief,
              or something that's never been done before — I want to hear it.
            </p>

            <div className="space-y-4">
              {[
                { icon: <EmailIcon />, label: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                { icon: <IGIcon />,    label: '@flyingsid',       href: SITE_CONFIG.instagram },
              ].map(({ icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-400 hover:text-rose-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center
                                  border border-white/10 group-hover:border-rose-500/50 transition-colors">
                    {icon}
                  </div>
                  <span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={onSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input name="name"  required placeholder="Your Name"  className={INPUT} />
                    <input name="email" type="email" required placeholder="Email" className={INPUT} />
                  </div>

                  <select name="projectType" defaultValue="" className={INPUT + ' cursor-pointer'}>
                    <option value="" disabled>Project Type</option>
                    {PROJECT_TYPES.map(t => (
                      <option key={t} value={t} className="bg-surface text-white">{t}</option>
                    ))}
                  </select>

                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your project..."
                    className={INPUT + ' resize-none'}
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-12 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-500/15 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl text-white tracking-wider mb-3">Message Sent</h3>
                  <p className="text-gray-500 text-sm">We'll be in touch within 24 hours.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
