import Scene from '@/components/canvas/Scene'
import Box from '@/components/canvas/Box'
import Particles from '@/components/canvas/Particles'

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* --- 背景レイヤー: 3Dシーン --- */}
      <div className="absolute inset-0 z-0">
        <Scene>
          {/* パーティクルを追加 */}
          <Particles />
          
          {/* 箱もアクセントとして残す（不要なら削除OK） */}
          <Box position={[0, 0, 0]} />
        </Scene>
      </div>

      {/* --- 前景レイヤー: 文字コンテンツ --- */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center pointer-events-none">
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-lg">
            DIGITAL REALITY
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            WebGLとWebGPUの実験場へようこそ。<br />
            ここでは技術的な探求と創作活動を公開しています。
          </p>
          
          <div className="pointer-events-auto">
            <a href="/works" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">
              View Works
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}