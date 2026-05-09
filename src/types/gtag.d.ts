interface Window {
  gtag: (command: string, id: string, config?: Record<string, any>) => void
  dataLayer: Record<string, any>[]
}
