import Link from 'next/link'
import ThemeToggle from '@/components/dom/ThemeToggle'
import Logo from '@/components/dom/Logo'

export default function Header() {
  return (
    // bg-gray-900: 背景色を濃いグレーに設定
    // text-white: 文字色を白に設定
    <header className="fixed top-0 left-0 z-50 w-full bg-header text-white shadow-md">
      {/* コンテナで中身を中央寄せ + 左右余白 */}
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* 左側：ロゴ */}
        {/* text-xl: 文字サイズ大, font-bold: 太字 */}
        <div className="flex items-center mr-8">
          <Link href="/" className="flex items-center gap-3 text-txt-main hover:text-primary transition-colors group">
            {/* ロゴ配置: w-8 h-8 (32px) 程度に設定 */}
            <div className="w-8 h-8 text-txt-main transition-colors">
              <Logo />
            </div>
            
            {/* タイトル */}
            <span className="text-xl font-bold">
              SnowCG
            </span>
          </Link>
        </div>

        {/* 右側：ナビゲーション */}
        <div className="flex items-center gap-6">
          <nav>
            {/* gap-6: メニュー同士の間隔 */}
            <ul className="flex gap-6 text-sm font-medium">
              <li><Link href="/about" className="hover:text-primary">ABOUT</Link></li>
              <li><Link href="/works" className="hover:text-primary">WORKS</Link></li>
              <li><Link href="/blog" className="hover:text-primary">BLOG</Link></li>
            </ul>
          </nav>
          <div className="h-4 w-px bg-white"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}