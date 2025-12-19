import './globals.css'
import 'highlight.js/styles/atom-one-dark.css' // テーマはお好みで変更可能 (例: github-dark.css, monokai.css)
import 'katex/dist/katex.min.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/dom/Header'
import Footer from '@/components/dom/Footer'
import ClientEffects from '@/components/dom/ClientEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My CG Portfolio',
  description: 'WebGL Portfolio & Tech Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      {/* Tailwindが効かない場合でも最低限見れるように
        style属性（インラインスタイル）で黒背景を指定しています
      */}
      <body 
        className={`${inter.className} bg-black text-white antialiased flex flex-col min-h-screen`}
        style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header />
        
        <main className="flex-grow pt-20">
          {children}
        </main>

        <Footer />

        <ClientEffects />
      </body>
    </html>
  )
}