'use client'

import { useState, useRef, useEffect } from 'react'
import Scene from '@/components/canvas/Scene'

interface ViewCanvasProps {
  children: React.ReactNode
}

export default function ViewCanvas({ children }: ViewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 全画面切り替えハンドラ
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // 全画面状態の変更を監視してstateを更新
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`
        relative w-full rounded-xl overflow-hidden border border-border bg-black/50 shadow-2xl my-8 transition-all duration-500
        ${isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-none' : 'h-[400px] md:h-[500px]'}
      `}
    >
      <Scene>
        {children}
      </Scene>

      {/* コントロール UI (Canvasの上に重ねる) */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/60 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            // 縮小アイコン
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          ) : (
            // 拡大アイコン
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m0 0l-5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>

      {/* ヒントメッセージ (通常時のみ表示) */}
      {!isFullscreen && (
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <span className="px-3 py-1 bg-black/40 backdrop-blur text-xs text-gray-300 rounded-full border border-white/5">
            Click & Drag to Rotate
          </span>
        </div>
      )}
    </div>
  )
}