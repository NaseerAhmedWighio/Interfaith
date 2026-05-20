'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Menu, X } from 'lucide-react'
import logo from "../../public/logo.png"
import Image from 'next/image'
import AuthButton from './AuthButton'

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="nav-premium fixed w-full z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-3 md:py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-end gap-2 group" onClick={closeMobileMenu}>
            <Image className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' src={logo} alt='Interfaith Peace Bridge' />
            <span className="text-[14px] sm:text-lg md:text-xl lg:text-2xl heading-premium text-[#C8A75E]">
              Interfaith Peace Bridge
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-1">
            <NavLink href="/mission" active={isActive('/mission')}>
              Our Mission
            </NavLink>
            <NavLink href="/teachings" active={isActive('/teachings')}>
              Teachings
            </NavLink>
            <NavLink href="/sacred-texts-explorer" active={isActive('/sacred-texts-explorer')}>
              Sacred Texts
            </NavLink>
            <NavLink href="/truth" active={isActive('/truth')}>
              Truth
            </NavLink>
            <NavLink href="/traditions" active={isActive('/traditions')}>
              Traditions
            </NavLink>
            <NavLink href="/peace" active={isActive('/peace')}>
              Peace Work
            </NavLink>
            <NavLink href="/share-quotes" active={isActive('/share-quotes')}>
              Share
            </NavLink>
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/join" className="btn-secondarys inline-flex items-center text-sm px-5 py-2.5">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Movement
            </Link>
            <AuthButton />
          </div>

          {/* Mobile: AuthButton + Menu Button */}
          <div className="flex items-center gap-1 lg:hidden">
            <div className="flex items-center justify-center">
              <AuthButton />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#f5f3ee] hover:text-[#c8a75e] hover:bg-[#c8a75e]/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
            <MobileNavLink href="/mission" active={isActive('/mission')} onClick={closeMobileMenu}>
              Our Mission
            </MobileNavLink>
            <MobileNavLink href="/teachings" active={isActive('/teachings')} onClick={closeMobileMenu}>
              Teachings
            </MobileNavLink>
            <MobileNavLink href="/sacred-texts-explorer" active={isActive('/sacred-texts-explorer')} onClick={closeMobileMenu}>
              Sacred Texts
            </MobileNavLink>
            <MobileNavLink href="/truth" active={isActive('/truth')} onClick={closeMobileMenu}>
              Truth
            </MobileNavLink>
            <MobileNavLink href="/traditions" active={isActive('/traditions')} onClick={closeMobileMenu}>
              Traditions
            </MobileNavLink>
            <MobileNavLink href="/peace" active={isActive('/peace')} onClick={closeMobileMenu}>
              Peace Work
            </MobileNavLink>
            <MobileNavLink href="/share-quotes" active={isActive('/share-quotes')} onClick={closeMobileMenu}>
              Share
            </MobileNavLink>
            <Link
              href="/join"
              className="btn-secondary w-full inline-flex items-center justify-center text-sm px-5 py-3 mt-3"
              onClick={closeMobileMenu}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Movement
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
        active
          ? 'text-[#c8a75e]'
          : 'text-[#f5f3ee]/80 hover:text-[#c8a75e]'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#c8a75e] rounded-full"></span>
      )}
    </Link>
  )
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        active
          ? 'text-[#c8a75e] bg-[#c8a75e]/10 border-l-4 border-[#c8a75e]'
          : 'text-[#f5f3ee]/80 hover:text-[#c8a75e] hover:bg-[#c8a75e]/5 border-l-4 border-transparent'
      }`}
    >
      {children}
    </Link>
  )
}
