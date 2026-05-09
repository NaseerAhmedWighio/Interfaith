import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
