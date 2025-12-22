import Scene from '@/components/canvas/Scene'
import Particles from '@/components/canvas/Particles'
import Box from '@/components/canvas/Box'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      
      {/* --- 背景レイヤー: 3Dシーン --- */}
      <div className="absolute inset-0 z-0">
        <Scene>
          <Particles />
          {/* アクセントとして中央にBox (クリックで反応する要素として) */}
          {/* <Box position={[0, 0, 0]} /> */}
        </Scene>
      </div>

      {/* --- 前景レイヤー: 文字コンテンツ --- */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center pointer-events-none px-4">
        
        <div className="container mx-auto max-w-4xl text-center">
          {/* メインタイトル */}
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-gray-500 drop-shadow-2xl">
            SnowCG Lab
          </h1>
          
          <p className="text-xl md:text-2xl text-txt-muted font-light tracking-wide max-w-2xl mx-auto mb-12 drop-shadow-md leading-relaxed">
            こんにちは，世界！
          </p>
          
          {/* ナビゲーションボタン (Pointer Events Auto) */}
          <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            
            {/* About Button */}
            <Link 
              href="/about" 
              // bg-card: 定義済みのカード色を使用
              // text-txt-main: メイン文字色を使用
              className="group relative flex items-center justify-center px-8 py-4 bg-card hover:bg-card/10 border border-border rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50"
            >
              <div className="text-center">
                <div className="text-xs text-txt-muted mb-1 group-hover:text-primary transition-colors">Introduction</div>
                <div className="text-lg font-bold text-txt-main">About Me</div>
              </div>
            </Link>

            {/* Works Button (Main CTA) */}
            <Link 
              href="/works" 
              // className="group relative flex items-center justify-center px-8 py-4 bg-white text-black rounded-xl shadow-lg shadow-white/10 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
              className="group relative flex items-center justify-center px-8 py-4 bg-card hover:bg-card/10 border border-border rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50"
            >
              <div className="text-center">
                <div className="text-xs text-txt-muted mb-1 group-hover:text-primary transition-colors">Portfolio</div>
                <div className="text-lg font-bold text-txt-main">View Works</div>
              </div>
            </Link>

            {/* Blog Button */}
            <Link 
              href="/blog" 
              className="group relative flex items-center justify-center px-8 py-4 bg-card hover:bg-card/10 border border-border rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50"
            >
              <div className="text-center">
                <div className="text-xs text-txt-muted mb-1 group-hover:text-primary transition-colors">Graphics/Tech/Journal</div>
                <div className="text-lg font-bold text-txt-main">Read Blog</div>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}