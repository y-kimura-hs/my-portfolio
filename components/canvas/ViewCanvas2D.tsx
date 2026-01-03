'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Leva } from 'leva'
import { createPortal } from 'react-dom'

interface ViewCanvas2DProps {
  children: React.ReactNode
}

export default function ViewCanvas2D({ children }: ViewCanvas2DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGUI, setShowGUI] = useState(true) // GUI表示状態の管理
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 全画面切り替え
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // GUI切り替え
  const toggleGUI = useCallback(() => {
    setShowGUI((prev) => !prev)
  }, [])

  // Escキーで解除
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
      // 'h'キーでGUIの表示切り替え（オプション）
      if (e.key === 'h' && isFullscreen) {
        setShowGUI((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // 全画面時はbodyのスクロールを無効化
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  if (!mounted) return null

  // 共通のCanvas要素
  const canvasContent = (
    <>
      {/* GUIパネル: showGUIステートで表示制御 */}
      <div 
        className={`absolute top-4 right-4 z-50 transition-opacity duration-300 ${showGUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Leva 
          fill 
          flat 
          titleBar={false} 
          theme={{
            sizes: { rootWidth: '280px' },
            colors: { elevation1: 'rgba(0,0,0,0.8)' } 
          }}
          // showGUIがfalseの時は非表示にする（Leva自体のhiddenプロパティを使用しても良いが、今回は親divで制御）
          hidden={!showGUI} 
        />
      </div>

      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0, far: 2 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {children}
        <Preload all />
      </Canvas>

      <div className="absolute bottom-4 right-4 z-40 flex gap-2 pointer-events-auto">
        {/* GUI表示切り替えボタン */}
        <button
          onClick={toggleGUI}
          className="p-2 bg-black/60 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
          title={showGUI ? "Hide Controls" : "Show Controls"}
        >
          {showGUI ? (
            // Eye Open Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // Eye Off Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>

        {/* 全画面切り替えボタン */}
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/60 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m0 0l-5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>
    </>
  )

  // 全画面モード（Portal使用）
  if (isFullscreen) {
    return (
      <>
        {/* プレースホルダー: 元の場所に高さを残す */}
        <div className="w-full h-[400px] md:h-[500px]" />
        
        {/* 全画面オーバーレイ */}
        {createPortal(
          <div 
            className="fixed inset-0 z-[9999] bg-black"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              margin: 0, 
              padding: 0 
            }}
          >
            {canvasContent}
          </div>,
          document.body
        )}
      </>
    )
  }

  // 通常モード
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border bg-black shadow-2xl my-8 transition-all duration-500 group"
    >
      {canvasContent}
    </div>
  )
}