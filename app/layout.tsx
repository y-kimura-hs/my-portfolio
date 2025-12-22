import './globals.css'
import 'highlight.js/styles/atom-one-dark.css' // テーマはお好みで変更可能 (例: github-dark.css, monokai.css)
import 'katex/dist/katex.min.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/dom/Header'
import Footer from '@/components/dom/Footer'
import ClientEffects from '@/components/dom/ClientEffects'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnowCG Lab',
  description: 'Portfolio & Tech Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      {/* Tailwindが効かない場合でも最低限見れるように
        style属性（インラインスタイル）で黒背景を指定しています
      */}
      <body 
        className={`${inter.className} bg-background text-foreground antialiased flex flex-col min-h-screen`}
        // style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <ThemeProvider>
          <Header />
          
          <main className="flex-grow">
            {children}
          </main>

          <Footer />

          <ClientEffects />
        </ThemeProvider>
      </body>
    </html>
  )
}