'use client'

import { useState, memo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Database,
  BookOpen,
  MessageSquare,
  FileText,
  Heart,
  Users,
  Mail,
  Share2,
  TrendingUp,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  Settings,
  ClipboardCheck
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = memo(function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch {} finally {
        setAuthLoaded(true)
      }
    }
    loadUser()
  }, [])

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
      adminOnly: true
    },
    {
      title: 'Content Review',
      href: '/admin/content-review',
      icon: ClipboardCheck,
      moderatorOnly: true
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
      adminOnly: true
    },
    {
      title: 'Role Requests',
      href: '/admin/role-requests',
      icon: Settings,
      adminOnly: true
    },
    {
      title: 'Traditions',
      href: '/admin/traditions',
      icon: Database
    },
    {
      title: 'Teachings',
      href: '/admin/teachings',
      icon: BookOpen
    },
    {
      title: 'Misconceptions',
      href: '/admin/misconceptions',
      icon: MessageSquare
    },
    {
      title: 'Sacred Texts',
      href: '/admin/sacred-texts',
      icon: FileText
    },
    {
      title: 'Peace Initiatives',
      href: '/admin/peace-initiatives',
      icon: Heart
    },
    {
      title: 'Movement Members',
      href: '/admin/movement-members',
      icon: Users
    },
    {
      title: 'Newsletter',
      href: '/admin/newsletter-subscribers',
      icon: Mail,
      adminOnly: true
    },
    {
      title: 'Shareable Quotes',
      href: '/admin/shareable-quotes',
      icon: Share2,
      adminOnly: true
    },
    {
      title: 'Similarity Themes',
      href: '/admin/similarity-themes',
      icon: TrendingUp,
      adminOnly: true
    },
    {
      title: 'Assessment Results',
      href: '/admin/assessment-results',
      icon: BarChart3,
      adminOnly: true
    }
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1f3a] rounded-xl border border-[#c8a75e]/20"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-[#c8a75e]" />
        ) : (
          <Menu className="w-6 h-6 text-[#c8a75e]" />
        )}
      </button>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen bg-[#0f1429]/95 backdrop-blur-xl border-r border-[#c8a75e]/10 transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-[#c8a75e]/10">
              <div className="flex items-center justify-between gap-3">
                {/* Mobile close button - left side */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-[#c8a75e]" />
                </button>

                {/* Admin Panel Text - right side on mobile, left on desktop */}
                {sidebarOpen && (
                  <div className="flex-1 text-right lg:text-left">
                    <h2 className="text-lg lg:text-xl font-bold text-gradient-primary">Admin Panel</h2>
                    <p className="text-xs text-premium-light mt-1">Interfaith Peace Bridge</p>
                  </div>
                )}

                {/* Desktop collapse button - right side */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors flex-shrink-0"
                >
                  <ChevronLeft
                    className={`w-5 h-5 text-[#c8a75e] transition-transform ${
                      !sidebarOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-3 custom-scrollbar">
              <div className="space-y-1">
                {menuItems.filter(item => {
                  if (!authLoaded || !user) return true
                  if (user.role === 'admin') return true
                  if (user.role === 'moderator') return !item.adminOnly
                  return !item.adminOnly && !item.moderatorOnly
                }).map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href, item.exact)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 lg:py-3 rounded-xl transition-all group ${
                        active
                          ? 'bg-gradient-to-r from-[#c8a75e]/20 to-[#d4b56d]/20 text-[#c8a75e] border border-[#c8a75e]/30'
                          : 'text-premium-light hover:bg-[#c8a75e]/10 hover:text-[#c8a75e]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#c8a75e]' : ''}`} />
                      {sidebarOpen && (
                        <span className="text-sm font-medium truncate">{item.title}</span>
                      )}
                      {active && sidebarOpen && (
                        <div className="ml-auto w-2 h-2 bg-[#c8a75e] rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#c8a75e]/10">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-premium-light hover:text-[#c8a75e] transition-colors"
              >
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Back to Site</span>}
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8 min-w-screen max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
})

export default AdminLayout
