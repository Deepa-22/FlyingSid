import { useState } from 'react'
import Splash          from './components/Splash'
import Navbar          from './components/Navbar'
import CustomCursor    from './components/CustomCursor'
import ScrollProgress  from './components/ScrollProgress'
import Hero       from './sections/Hero'
import About      from './sections/About'
import FeaturedIn from './sections/FeaturedIn'
import Showreels  from './sections/Showreels'
import Gallery    from './sections/Gallery'
import Gear       from './sections/Gear'
import Services   from './sections/Services'
import Instagram  from './sections/Instagram'
import Shop      from './sections/Shop'
import Hiring     from './sections/Hiring'
import Contact    from './sections/Contact'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      {!splashDone && <Splash onFinish={() => setSplashDone(true)} />}

      {splashDone && (
        <div className="relative bg-void min-h-screen text-white">
          {/* Animated film grain overlay */}
          <div className="film-grain" aria-hidden="true" />

          <Navbar />

          <main>
            <Hero />
            <About />
            <FeaturedIn />
            <Showreels />
            <Gallery />
            <Gear />
            <Services />
            <Instagram />
            <Shop />
            <Hiring />
            <Contact />
          </main>

          <footer className="py-8 border-t border-white/5 text-center text-gray-700
                             text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} Flying Sid. All rights reserved.
          </footer>
        </div>
      )}
    </>
  )
}
