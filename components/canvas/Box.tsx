'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Box(props: any) {
  // THREE.Meshへの参照を取得
  const meshRef = useRef<THREE.Mesh>(null!)
  
  // ホバー状態とクリック状態を管理
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  // 毎フレーム実行されるループ処理 (アニメーション)
  useFrame((state, delta) => {
    // x軸とy軸方向に回転させる
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })
  
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      {/* 箱の形状 (幅, 高さ, 奥行き) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* マテリアル (色と質感) */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}