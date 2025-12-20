'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- シェーダー定義 ---

const vertexShader = `
  uniform float uTime;
  uniform vec2 uCursor;
  uniform float uPixelRatio; // 画面のピクセル比を追加
  
  attribute float aScale; // 名前を統一して受け取る
  
  varying vec2 vUv;
  varying float vDistance;

  void main() {
    vec3 pos = position;

    // 波打つ動き
    pos.y += sin(pos.x * 2.0 + uTime) * 0.2;
    pos.z += cos(pos.y * 1.5 + uTime) * 0.2;

    // マウスとの距離計算
    float dist = distance(pos.xy, uCursor * 5.0);
    vDistance = dist;

    // マウスホバー効果
    float hoverEffect = smoothstep(2.0, 0.0, dist);
    pos.z += hoverEffect * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // サイズ計算: ピクセル比(uPixelRatio)を掛けて、高解像度画面でも小さくならないようにする
    // 30.0 -> 50.0 に大きくしました
    gl_PointSize = (aScale * 50.0 * uPixelRatio * (1.0 + hoverEffect)) / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform float uTime;
  varying float vDistance;

  void main() {
    // 丸くする
    float strength = distance(gl_PointCoord, vec2(0.5));
    if(strength > 0.5) discard;

    // 色の計算
    vec3 color1 = vec3(0.1, 0.3, 0.8);
    vec3 color2 = vec3(1.0, 0.5, 0.2);
    
    float mixRatio = smoothstep(2.0, 0.0, vDistance);
    vec3 finalColor = mix(color1, color2, mixRatio);

    // アルファ値
    float alpha = (0.5 - strength) * 2.0;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export default function Particles(props: any) {
  const count = 5000
  const mesh = useRef<THREE.Points>(null!)
  
  // ピクセル比を取得 (SSR対策で初期値は1)
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: pixelRatio } // シェーダーに渡す
    }),
    [pixelRatio]
  )

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const distance = 10 
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * distance * 1.5
      const y = (Math.random() - 0.5) * distance
      const z = (Math.random() - 0.5) * distance
      positions.set([x, y, z], i * 3)
      scales[i] = Math.random()
    }
    return { positions, scales }
  }, [count])

  useFrame((state) => {
    const { clock, pointer } = state
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial

      material.uniforms.uTime.value = clock.getElapsedTime()
      // マウス位置の更新 (lerpで滑らかに)
      material.uniforms.uCursor.value.lerp(pointer, 0.1)
    }
  })

  return (
    <points ref={mesh} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        {/* 重要: attach="attributes-aScale" にして、シェーダーの attribute float aScale と名前を合わせる */}
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
          args={[scales, 1]}
        />
      </bufferGeometry>
      
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}