'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import ThemeToggle from '@/components/dom/ThemeToggle'
import Logo from '@/components/dom/Logo'

export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setIsVisible(true)
      } 
      else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`
        fixed top-0 left-0 z-50 w-full 
        bg-header/80 backdrop-blur-md border-b border-border 
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      {/* justify-between で左右に配置を振り分けます */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ロゴ + タイトルエリア */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 text-txt-main hover:text-primary transition-colors group">
            <div className="w-8 h-8 text-txt-main group-hover:text-primary transition-colors">
              <Logo />
            </div>
            
            {/* ここがポイント！ */}
            {/* hidden: デフォルト（スマホ）で非表示 */}
            {/* md:block: 画面幅768px以上（PC/タブレット）で表示 */}
            <span className="text-xl font-bold hidden md:block">
              SnowCG
            </span>
          </Link>
        </div>

        {/* ナビゲーション + トグルボタン */}
        {/* スマホでは間隔を少し狭く (gap-4)、PCでは広く (md:gap-6) */}
        <div className="flex items-center gap-4 md:gap-6">
          <nav>
            {/* 文字サイズもスマホでは小さく (text-xs)、PCでは標準 (md:text-sm) */}
            <ul className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium text-txt-muted">
              <li><Link href="/about" className="hover:text-primary transition-colors">ABOUT</Link></li>
              <li><Link href="/works" className="hover:text-primary transition-colors">WORKS</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">BLOG</Link></li>
            </ul>
          </nav>

          <div className="h-4 w-px bg-border"></div>

          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}