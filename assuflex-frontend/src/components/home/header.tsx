import { useState, useRef, useCallback, memo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Mail, Phone, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import logo from "../../assets/Orange Minimalist Logo4444.svg"
import OriasLogo from "../../assets/logo-orias.png"

const SocialIcons = memo(() => (
  <div className="flex gap-1">
    {[
      {
        href: "#",
        path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
      },
      {
        href: "#",
        path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
      },
      {
        href: "#",
        path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
      },
      {
        href: "#",
        path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
      },
    ].map((icon, index) => (
      <a
        key={index}
        href={icon.href}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d={icon.path} />
        </svg>
      </a>
    ))}
  </div>
))

const NavLinks = memo(({ mobile = false }: { mobile?: boolean }) => {
  const links = [
    { to: "/", label: "Accueil" },
    { to: "/nos-garanties", label: "Nos garanties" },
    { to: "/Qui-sommes-nous", label: "Qui sommes-nous" },
    { to: "/contact", label: "Contact" },
    { to: "/paiement-securise", label: "Paiement sécurisé" },
  ]

  return (
    <nav className={mobile ? "flex flex-col gap-4 mt-4" : "hidden md:flex items-center gap-6"}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-base font-medium transition-colors duration-300 ${
            mobile ? "text-[#003E8A] border-b pb-2 hover:text-[#003E8A]" : "text-[#003E8A] hover:text-[#003E8A]"
          }`}
          
        >
          {link.label === "Nos garanties" ? <span translate="no">Nos garanties</span> : link.label}
        </Link>
      ))}
      {mobile && (
        <>
          <Link to="/login" className="mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full py-2 px-6 text-base font-medium">
              Espace Client
            </Button>
          </Link>
          <Link to="/insurance" className="mt-4">
            <Button className="bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full w-full py-2 px-6 text-base font-medium">
              Devis immédiat
            </Button>
          </Link>
        </>
      )}
    </nav>
  )
})

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const mainNavRef = useRef(null)
  const topBarRef = useRef(null)
  const logoRef = useRef(null)
  const navRef = useRef(null)
  const mobileNavRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(logoRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
    if (navRef.current)
      gsap.fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3 })
    if (topBarRef.current) gsap.fromTo(topBarRef.current, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: 0.3 })

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "+=100",
      scrub: true,
      onEnter: () => gsap.to(mainNavRef.current, { position: "sticky", top: 0, duration: 0.2 }),
      onLeaveBack: () => gsap.to(mainNavRef.current, { position: "relative", duration: 0.2 }),
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open)
    if (open && mobileNavRef.current) {
      gsap.fromTo(mobileNavRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.2 })
    }
  }, [])

  return (
    <>
      <div
        ref={topBarRef}
        className="py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center bg-gray-50 text-sm"
      >
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="mailto:contact@assuflex.fr" className="flex items-center gap-2 text-blue-800 hover:text-blue-600">
            <Mail size={16} />
            contact@assuflex.fr
          </a>
          <a href="tel:+330189600006" className="flex items-center gap-2 text-blue-800 hover:text-blue-600">
            <Phone size={16} />
            +33 01 89 60 00 06
          </a>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <SocialIcons />
          <img src={OriasLogo || "/placeholder.svg"} alt="Orias Logo" className="h-12" />
        </div>
      </div>

      <header className="bg-[#fef9f8] sticky top-0 z-50 w-full shadow-sm">
        <div ref={mainNavRef} className="py-3 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden border-blue-500 bg-blue-700 text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                  <div className="p-6">
                    <Link to="/" className="inline-block mb-4">
                      <img src={logo || "/placeholder.svg"} alt="Assuflex Logo" className="h-10" />
                    </Link>
                    <div ref={mobileNavRef}>
                      <NavLinks mobile />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/" className="hidden md:block" ref={logoRef}>
                <img src={logo} alt="Assuflex Logo" className="h-10" />
              </Link>

              <div ref={navRef}>
                <NavLinks />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/insurance">
                <Button className="bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full px-6 py-2 text-base font-medium">
                  Devis immédiat
                </Button>
              </Link>
              <Link to="/login" className="hidden lg:block">
                <Button className="bg-[#003E8A] hover:bg-[#002F6C]  text-white rounded-full px-6 py-2 text-base font-medium">
                  Espace Client
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
