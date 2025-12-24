'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/dom/ThemeToggle'
import Logo from '@/components/dom/Logo'
import { useState, useEffect, useRef } from 'react'


export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // スクロール判定ロジック
      // 1. 上にスクロールした (current < last)
      // 2. または、ページの最上部付近にいる (current < 50)
      // -> 表示する (isVisible = true)
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setIsVisible(true)
      } 
      // 3. 下にスクロールした かつ 最上部ではない
      // -> 隠す (isVisible = false)
      else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false)
      }

      // 現在位置を保存
      lastScrollY.current = currentScrollY
    }

    // イベントリスナー登録
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // クリーンアップ
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
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* ロゴ + タイトルエリア */}
        <div className="flex items-center mr-8">
          <Link href="/" className="flex items-center gap-3 text-txt-main hover:text-primary transition-colors group">
            <div className="w-8 h-8 text-txt-main group-hover:text-primary transition-colors">
              <Logo />
            </div>
            <span className="text-xl font-bold">
              SnowCG
            </span>
          </Link>
        </div>

        {/* ナビゲーション + トグルボタン */}
        <div className="flex items-center gap-6">
          <nav>
            <ul className="flex gap-6 text-sm font-medium text-txt-muted">
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