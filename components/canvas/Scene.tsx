'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'

interface SceneProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Scene({ children, className, style, ...props }: SceneProps) {
  return (
    <div 
      className={`w-full h-full ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
    >
      <Canvas {...props}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {children}
        
        {/* OrbitControlsの設定:
          enableZoom={false} -> スクロール操作を無効化（ページスクロールを優先）
          autoRotate -> ゆっくり自動回転させてリッチに見せる
        */}
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
        <Preload all />
      </Canvas>
    </div>
  )
}