import Link from 'next/link'

export default function Header() {
  return (
    // bg-gray-900: 背景色を濃いグレーに設定
    // text-white: 文字色を白に設定
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-900 text-white shadow-md">
      {/* コンテナで中身を中央寄せ + 左右余白 */}
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* 左側：ロゴ */}
        {/* text-xl: 文字サイズ大, font-bold: 太字 */}
        <div className="text-xl font-bold">
          <Link href="/">MY LAB</Link>
        </div>

        {/* 右側：ナビゲーション */}
        <nav>
          {/* gap-6: メニュー同士の間隔 */}
          <ul className="flex gap-6 text-sm font-medium">
            <li><Link href="/about" className="hover:text-gray-300">ABOUT</Link></li>
            <li><Link href="/works" className="hover:text-gray-300">WORKS</Link></li>
            <li><Link href="/blog" className="hover:text-gray-300">BLOG</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}