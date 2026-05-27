import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const lag     = useRef({ x: -200, y: -200 })
  const rafId   = useRef(null)
  const [pointer, setPointer] = useState(false)
  const [hidden,  setHidden]  = useState(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const onMove  = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; setHidden(false) }
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)
    const onOver  = (e) => {
      const cur = window.getComputedStyle(e.target).cursor
      setPointer(cur === 'pointer' || cur === 'zoom-in')
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover', onOver)

    const loop = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.12
      lag.current.y += (mouse.current.y - lag.current.y) * 0.12
      if (dotRef.current)
        dotRef.current.style.transform =
          `translate3d(${mouse.current.x}px,${mouse.current.y}px,0) translate(-50%,-50%)`
      if (ringRef.current)
        ringRef.current.style.transform =
          `translate3d(${lag.current.x}px,${lag.current.y}px,0) translate(-50%,-50%)`
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden lg:block"
        style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.2s' }}
      >
        <div className="relative w-0 h-0">
          <div
            className="absolute w-[5px] h-[5px] rounded-full bg-rose-500 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150"
            style={{ transform: `translate(-50%,-50%) scale(${pointer ? 2.5 : 1})` }}
          />
          <div className="absolute left-[-0.5px] -top-[20px] w-px h-[13px] bg-rose-500/75" />
          <div className="absolute left-[-0.5px] top-[7px]  w-px h-[13px] bg-rose-500/75" />
          <div className="absolute -left-[20px] top-[-0.5px] w-[13px] h-px bg-rose-500/75" />
          <div className="absolute left-[7px]  top-[-0.5px] w-[13px] h-px bg-rose-500/75" />
        </div>
      </div>

      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none hidden lg:block z-[9997] rounded-full
                   transition-[width,height,border-color,opacity] duration-200"
        style={{
          width:       pointer ? '44px' : '34px',
          height:      pointer ? '44px' : '34px',
          border:      `1px solid ${pointer ? 'rgba(244,63,94,0.55)' : 'rgba(244,63,94,0.28)'}`,
          opacity:     hidden ? 0 : 1,
        }}
      />
    </>
  )
}
