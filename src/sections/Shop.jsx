import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_PRODUCTS } from '../utils/constants'

const CATEGORIES = [
  { id: 'all',         label: 'All Gear' },
  { id: 'drones',      label: 'Drones' },
  { id: 'parts',       label: 'Parts' },
  { id: 'accessories', label: 'Accessories' },
]

const CAT_GRADIENT = {
  drones:      'from-rose-700/50 via-red-900/30 to-surface',
  parts:       'from-blue-700/50 via-blue-900/30 to-surface',
  accessories: 'from-violet-700/50 via-violet-900/30 to-surface',
}
const CAT_GLOW = {
  drones:      '#f43f5e',
  parts:       '#60a5fa',
  accessories: '#a78bfa',
}
const BADGE_CLS = {
  Bestseller: 'bg-rose-500 text-white',
  New:        'bg-emerald-500 text-white',
  Hot:        'bg-orange-500 text-white',
  Bundle:     'bg-sky-500 text-white',
  Limited:    'bg-amber-400 text-black',
  Custom:     'bg-violet-500 text-white',
  Premium:    'bg-gradient-to-r from-yellow-400 to-amber-300 text-black',
}

// ── Icons ────────────────────────────────────────────────────────────────────

function DroneIcon() {
  return (
    <svg className="w-16 h-16 text-white/15" viewBox="0 0 64 64" fill="currentColor">
      <circle cx="32" cy="32" r="5" />
      <line x1="32" y1="27" x2="17" y2="14" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="27" x2="47" y2="14" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="37" x2="17" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="37" x2="47" y2="50" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="47" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="47" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PartIcon() {
  return (
    <svg className="w-16 h-16 text-white/15" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="32" cy="32" r="12" />
      <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity="0.3" />
      <line x1="32" y1="20" x2="32" y2="10" />
      <line x1="32" y1="44" x2="32" y2="54" />
      <line x1="20"  y1="32" x2="10" y2="32" />
      <line x1="44"  y1="32" x2="54" y2="32" />
      <line x1="23.5" y1="23.5" x2="16" y2="16" />
      <line x1="40.5" y1="40.5" x2="48" y2="48" />
      <line x1="40.5" y1="23.5" x2="48" y2="16" />
      <line x1="23.5" y1="40.5" x2="16" y2="48" />
    </svg>
  )
}

function AccessoryIcon() {
  return (
    <svg className="w-16 h-16 text-white/15" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="12" y="22" width="40" height="28" rx="5" />
      <path d="M22 22v-5a3 3 0 013-3h14a3 3 0 013 3v5" />
      <circle cx="32" cy="36" r="5" fill="currentColor" fillOpacity="0.25" />
    </svg>
  )
}

const ICON_MAP = { drones: DroneIcon, parts: PartIcon, accessories: AccessoryIcon }

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 })
  const [added, setAdded] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const Icon = ICON_MAP[product.category] || DroneIcon

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({ rx: (py - 0.5) * -15, ry: (px - 0.5) * 15, gx: px * 100, gy: py * 100 })
  }, [])

  const onMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })
  }, [])

  const handleAdd = () => {
    setAdded(true)
    onAdd(product)
    setTimeout(() => setAdded(false), 700)
  }

  const isResting = tilt.rx === 0 && tilt.ry === 0

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: isResting
          ? 'transform 0.55s cubic-bezier(.03,.98,.52,.99)'
          : 'transform 0.05s linear',
        willChange: 'transform',
      }}
      className="relative rounded-2xl overflow-hidden bg-surface border border-white/8 group"
    >
      {/* Holographic shimmer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, ${CAT_GLOW[product.category]}22 0%, transparent 60%)`,
        }}
      />

      {/* Image area */}
      <div className={`relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br ${CAT_GRADIENT[product.category]}`}>
        {[0, 1].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-white/5 animate-ping"
            style={{
              width:  `${88 + i * 44}px`,
              height: `${88 + i * 44}px`,
              animationDelay:    `${i * 1.1}s`,
              animationDuration: '2.8s',
            }}
          />
        ))}
        <div className="relative z-10">
          <Icon />
        </div>
        {product.badge && (
          <span className={`absolute top-3 left-3 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-widest ${BADGE_CLS[product.badge]}`}>
            {product.badge.toUpperCase()}
          </span>
        )}
        <span className="absolute bottom-2.5 right-3 z-20 text-[9px] text-white/25 tracking-widest uppercase">
          #{product.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-[15px] leading-snug mb-1 text-white group-hover:text-rose-300 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-600 leading-relaxed mb-3 line-clamp-2">{product.desc}</p>

        <button
          onClick={() => setShowSpecs(v => !v)}
          className="flex items-center gap-1 text-[10px] text-gray-700 hover:text-gray-400 uppercase tracking-widest mb-1 transition-colors"
        >
          Specs
          <span style={{ display: 'inline-block', transition: 'transform .2s', transform: showSpecs ? 'rotate(180deg)' : 'none' }}>▾</span>
        </button>

        <AnimatePresence initial={false}>
          {showSpecs && (
            <motion.ul
              key="specs"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-1 mb-2"
            >
              {product.specs.map(s => (
                <li key={s} className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="flex items-end justify-between pt-4 border-t border-white/8 mt-2">
          <div>
            <p className="text-[9px] text-gray-700 tracking-widest uppercase mb-0.5">Price</p>
            <p className="font-display text-2xl text-white leading-none">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleAdd}
            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${
              added ? 'bg-emerald-500 text-white' : 'bg-rose-500 hover:bg-rose-400 text-white'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────

function CartDrawer({ items, onClose, onQtyChange, onRemove }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  const orderText =
    `Hi Flying Sid! I'd like to order:\n\n` +
    items.map(i => `• ${i.name} ×${i.qty} — ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n') +
    `\n\nTotal: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability and shipping details.`

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-full w-[min(100vw,400px)] bg-[#0d0d0d] border-l border-white/10 z-[70] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <p className="font-display text-xl">Cart</p>
            <p className="text-[10px] text-gray-600 tracking-widest">{count} item{count !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >×</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-700">
            <svg className="w-14 h-14 opacity-20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 56 56">
              <path d="M7 7h5l9 28h24l5-21H18" />
              <circle cx="22" cy="45" r="4" />
              <circle cx="40" cy="45" r="4" />
            </svg>
            <p className="text-sm tracking-widest uppercase">Nothing here yet</p>
            <button
              onClick={onClose}
              className="text-xs text-rose-400 hover:text-rose-300 tracking-widest uppercase transition-colors"
            >Browse gear →</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex gap-3 p-3 rounded-xl border border-white/6"
                  >
                    <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${CAT_GRADIENT[item.category]} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white leading-snug truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-600 mb-2">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onQtyChange(item.id, item.qty - 1)}
                          className="w-5 h-5 rounded bg-white/8 hover:bg-white/15 text-xs flex items-center justify-center transition-colors"
                        >−</button>
                        <span className="text-xs text-gray-400 w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => onQtyChange(item.id, item.qty + 1)}
                          className="w-5 h-5 rounded bg-white/8 hover:bg-white/15 text-xs flex items-center justify-center transition-colors"
                        >+</button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="ml-auto w-5 h-5 rounded hover:bg-red-500/15 text-gray-700 hover:text-red-400 text-xs flex items-center justify-center transition-colors"
                        >✕</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-5 border-t border-white/8 space-y-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-gray-600 tracking-widest uppercase">Total</span>
                <span className="font-display text-3xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-gray-700 leading-relaxed">
                We'll confirm stock & shipping within 24 hrs after you reach out.
              </p>
              {[
                { number: '918867636073', label: 'WhatsApp +91 88676 36073' },
                { number: '917387682474', label: 'WhatsApp +91 73876 82474' },
              ].map(({ number, label }) => (
                <a
                  key={number}
                  href={`https://wa.me/${number}?text=${encodeURIComponent(orderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-widest uppercase transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.429A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.7 0-3.3-.43-4.7-1.19l-.34-.2-3.29.86.9-3.17-.21-.35A8 8 0 114 12c0 4.418 3.582 8 8 8z" />
                  </svg>
                  {label}
                </a>
              ))}
              <a
                href={`mailto:flyingsidflimz@gmail.com?subject=${encodeURIComponent('Shop Enquiry — ' + items.map(i => i.name).join(', '))}&body=${encodeURIComponent(orderText)}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 hover:border-white/30 text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-200"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email Enquiry
              </a>
            </div>
          </>
        )}
      </motion.aside>
    </>
  )
}

// ── Main Section ──────────────────────────────────────────────────────────────

export default function Shop() {
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [bump, setBump] = useState(false)

  const filtered = SHOP_PRODUCTS.filter(p => category === 'all' || p.category === category)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setBump(true)
    setTimeout(() => setBump(false), 450)
  }

  const changeQty = (id, qty) => {
    if (qty < 1) setCart(prev => prev.filter(i => i.id !== id))
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  return (
    <section id="shop" className="py-28 md:py-40 relative overflow-hidden bg-void">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      {/* Ambient glows */}
      <div className="absolute -top-48 left-1/3 w-[560px] h-[560px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 right-1/3 w-[560px] h-[560px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="section-subtitle text-rose-400 mb-3"
        >
          Shop
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="section-title mb-4"
        >
          FPV Arsenal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-sm tracking-wider mb-14 max-w-lg"
        >
          Pilot-grade builds, professional components and flight-tested accessories —
          every item hand-picked and flown by us.
        </motion.p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all duration-200 border ${
                category === cat.id
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-transparent border-white/10 text-gray-500 hover:border-white/25 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <ProductCard product={product} onAdd={addToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Custom build CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 rounded-2xl border border-white/8 bg-surface text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-white mb-3">Want a Custom Build?</p>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            We spec, build and tune bespoke FPV rigs for your exact shoot requirements.
            Tell us what you need — we'll make it fly.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-xl border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white text-sm tracking-widest uppercase font-medium transition-all duration-200"
          >
            Enquire Now
          </a>
        </motion.div>
      </div>

      {/* Floating cart button */}
      <motion.button
        animate={bump ? { scale: [1, 1.35, 0.9, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, times: [0, 0.2, 0.5, 0.75, 1] }}
        onClick={() => setCartOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-400 shadow-lg shadow-rose-500/40 flex items-center justify-center z-[50] transition-colors"
        aria-label="Open cart"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-white text-rose-500 text-[10px] font-bold flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            items={cart}
            onClose={() => setCartOpen(false)}
            onQtyChange={changeQty}
            onRemove={removeItem}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
