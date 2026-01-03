'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'
import { useControls, button, folder } from 'leva'
import {
  vertexShader,
  clearShader,
  splatShader,
  forceShader,
  advectionShader,
  divergenceShader,
  pressureShader,
  gradientSubtractShader,
  curlShader,
  vorticityShader,
  boundaryShader,
  displayShader,
} from './shaders'

type FBO = THREE.WebGLRenderTarget
// 参照を管理するための型
type FBOState = { read: FBO; write: FBO }

export default function FluidSimulation() {
  const { gl, size, viewport, pointer } = useThree()
  const meshRef = useRef<THREE.Mesh>(null!)
  
  const [resolution, setResolution] = useState(512) 
  const [resetCount, setResetCount] = useState(0)

  // GUI設定
  const config = useControls({
    'Simulation': folder({
      resolution: { 
        value: 512, options: { 'Low (256)': 256, 'Medium (512)': 512, 'High (1024)': 1024 }, 
        label: 'Resolution',
        onChange: (v) => setResolution(v) 
      },
      densityDissipation: { value: 0.99, min: 0.9, max: 1.0 },
      velocityDissipation: { value: 0.99, min: 0.9, max: 1.0 },
      pressureIterations: { value: 20, min: 1, max: 50, step: 1 },
      vorticity: { value: true, label: 'Vorticity Conf.' },
      curl: { value: 30, min: 0, max: 50, render: (get) => get('Simulation.vorticity') },
      gravity: { value: false },
      gravityY: { value: -50.0, min: -100, max: 100, render: (get) => get('Simulation.gravity') }, // 単位系に合わせてスケール調整
      'Reset': button(() => setResetCount(c => c + 1)),
    }, { collapsed: true }),
    'Interaction': folder({
      splatRadius: { value: 0.0025, min: 0.001, max: 0.02 },
      splatDensity: { value: 1.0, min: 0.0, max: 2.0, label: 'Density' }, // 色ではなくスカラー値に変更
    }, { collapsed: true }),
    // Boundariesフォルダを削除し、コード内で固定
    'Visualization': folder({
      mode: { options: { 'Density': 0, 'Velocity': 1, 'Curl': 2, 'Pressure': 3 }, value: 0 },
      colorA: { value: '#191970', label: 'Low Color' }, 
      colorB: { value: '#ff4500', label: 'High Color' }, 
      bias: { value: 1.0, min: 0.1, max: 10.0 },
    }, { collapsed: true })
  })

  const configRef = useRef(config)
  configRef.current = config

  // FBO setup
  const aspect = size.width / size.height
  const resX = Math.round(resolution * (aspect > 1 ? 1 : aspect))
  const resY = Math.round(resolution * (aspect > 1 ? 1 / aspect : 1))

  const fboOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType, // iOS等で動かない場合はHalfFloatTypeへ
    depthBuffer: false,
    stencilBuffer: false,
  }

  // FBOの実体を生成
  const density1 = useFBO(resX, resY, fboOptions)
  const density2 = useFBO(resX, resY, fboOptions)
  const velocity1 = useFBO(resX, resY, fboOptions)
  const velocity2 = useFBO(resX, resY, fboOptions)
  const pressure1 = useFBO(resX, resY, fboOptions)
  const pressure2 = useFBO(resX, resY, fboOptions)
  
  const divergence = useFBO(resX, resY, fboOptions)
  const curl = useFBO(resX, resY, fboOptions)

  // Double Bufferの状態管理
  const densityState = useRef<FBOState>({ read: density1, write: density2 })
  const velocityState = useRef<FBOState>({ read: velocity1, write: velocity2 })
  const pressureState = useRef<FBOState>({ read: pressure1, write: pressure2 })

  // 解像度変更時などにRefの中身をリセット
  useEffect(() => {
    densityState.current = { read: density1, write: density2 }
    velocityState.current = { read: velocity1, write: velocity2 }
    pressureState.current = { read: pressure1, write: pressure2 }
  }, [density1, density2, velocity1, velocity2, pressure1, pressure2])

  const materials = useMemo(() => {
    const texelSize = new THREE.Vector2(1 / resX, 1 / resY)
    const simRes = new THREE.Vector2(resX, resY)
    const baseUniforms = { texelSize: { value: texelSize } }
    const matOpts = { vertexShader, depthWrite: false, depthTest: false }

    return {
      clear: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: clearShader, uniforms: { value: { value: 0 } } }),
      splat: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: splatShader, uniforms: { ...baseUniforms, uTarget: { value: null }, aspectRatio: { value: aspect }, color: { value: new THREE.Vector3() }, point: { value: new THREE.Vector2() }, radius: { value: 0.0 } } }),
      force: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: forceShader, uniforms: { ...baseUniforms, velocity: { value: null }, force: { value: new THREE.Vector2() }, dt: { value: 0.016 } } }),
      advection: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: advectionShader, uniforms: { ...baseUniforms, velocity: { value: null }, source: { value: null }, dt: { value: 0.016 }, dissipation: { value: 1.0 } } }),
      divergence: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: divergenceShader, uniforms: { ...baseUniforms, velocity: { value: null } } }),
      curl: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: curlShader, uniforms: { ...baseUniforms, velocity: { value: null } } }),
      vorticity: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: vorticityShader, uniforms: { ...baseUniforms, velocity: { value: null }, curl: { value: null }, curlStrength: { value: 0.0 }, dt: { value: 0.016 } } }),
      pressure: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: pressureShader, uniforms: { ...baseUniforms, pressure: { value: null }, divergence: { value: null } } }),
      gradientSubtract: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: gradientSubtractShader, uniforms: { ...baseUniforms, pressure: { value: null }, velocity: { value: null } } }),
      boundary: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: boundaryShader, uniforms: { 
        uTarget: { value: null }, scale: { value: 1.0 }, simRes: { value: simRes }, uInvert: { value: 0.0 },
        uTop: { value: 0 }, uBottom: { value: 0 }, uLeft: { value: 0 }, uRight: { value: 0 }
      }}),
      display: new THREE.ShaderMaterial({ ...matOpts, fragmentShader: displayShader, uniforms: { 
        uDensity: { value: null }, uVelocity: { value: null }, uCurl: { value: null }, uPressure: { value: null },
        uMode: { value: 0 }, uColorA: { value: new THREE.Color() }, uColorB: { value: new THREE.Color() }, uBias: { value: 1.0 }
      }}),
    }
  }, [resX, resY, aspect])

  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const simScene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2)))
    return scene
  }, [])
  const plane = simScene.children[0] as THREE.Mesh

  // 初期化 (Clear)
  useEffect(() => {
    plane.material = materials.clear
    const targets = [
      densityState.current.read, densityState.current.write,
      velocityState.current.read, velocityState.current.write,
      pressureState.current.read, pressureState.current.write,
      divergence, curl
    ]
    targets.forEach(t => { gl.setRenderTarget(t); gl.render(simScene, simCamera); })
    gl.setRenderTarget(null)
  }, [gl, materials, resetCount, resolution])

  const lastMouse = useRef(new THREE.Vector2(0, 0))
  const isDragging = useRef(false)
  
  useEffect(() => {
    // const down = () => isDragging.current = true
    const down = (e: Event) => {
      if (e.target === gl.domElement) {
        isDragging.current = true
      }
    }
    const up = () => isDragging.current = false
    window.addEventListener('mousedown', down); window.addEventListener('touchstart', down)
    window.addEventListener('mouseup', up); window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousedown', down); window.removeEventListener('touchstart', down)
      window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up)
    }
  }, [])

  useFrame(({ gl, clock }) => {
    const currentConfig = configRef.current

    const dt = 0.016
    const render = (target: FBO) => { gl.setRenderTarget(target); gl.render(simScene, simCamera); }

    const swap = (state: React.MutableRefObject<FBOState>) => {
      const temp = state.current.read
      state.current.read = state.current.write
      state.current.write = temp
    }

    const applyBoundary = (state: React.MutableRefObject<FBOState>, invert: boolean) => {
      plane.material = materials.boundary
      materials.boundary.uniforms.uTarget.value = state.current.read.texture
      materials.boundary.uniforms.uInvert.value = invert ? 1.0 : 0.0
      render(state.current.write)
      swap(state)
    }

    // --- STEP 1: Velocity Advection ---
    plane.material = materials.advection
    materials.advection.uniforms.velocity.value = velocityState.current.read.texture
    materials.advection.uniforms.source.value = velocityState.current.read.texture
    materials.advection.uniforms.dissipation.value = currentConfig.velocityDissipation
    materials.advection.uniforms.dt.value = dt
    render(velocityState.current.write)
    swap(velocityState)
    applyBoundary(velocityState, true)

    // --- STEP 2: Forces (Mouse & Gravity & Vorticity) ---
    // Mouse Input (Velocity)
    if (isDragging.current) {
      const x = pointer.x * 0.5 + 0.5
      const y = pointer.y * 0.5 + 0.5
      const currentMouse = new THREE.Vector2(pointer.x, pointer.y)
      const diff = currentMouse.clone().sub(lastMouse.current).multiplyScalar(100.0)
      lastMouse.current.copy(currentMouse)

      plane.material = materials.splat
      materials.splat.uniforms.uTarget.value = velocityState.current.read.texture
      materials.splat.uniforms.point.value.set(x, y)
      materials.splat.uniforms.color.value.set(diff.x, diff.y, 0.0)
      materials.splat.uniforms.radius.value = currentConfig.splatRadius
      render(velocityState.current.write)
      swap(velocityState)
      applyBoundary(velocityState, true)
    } else {
      lastMouse.current.set(pointer.x, pointer.y)
    }

    // Gravity
    if (currentConfig.gravity) {
      plane.material = materials.force
      materials.force.uniforms.velocity.value = velocityState.current.read.texture
      materials.force.uniforms.force.value.set(0, currentConfig.gravityY)
      materials.force.uniforms.dt.value = dt
      render(velocityState.current.write)
      swap(velocityState)
      applyBoundary(velocityState, true)
    }

    // Vorticity Confinement
    if (currentConfig.vorticity) {
      plane.material = materials.curl
      materials.curl.uniforms.velocity.value = velocityState.current.read.texture
      render(curl)

      plane.material = materials.vorticity
      materials.vorticity.uniforms.velocity.value = velocityState.current.read.texture
      materials.vorticity.uniforms.curl.value = curl.texture
      materials.vorticity.uniforms.curlStrength.value = currentConfig.curl
      materials.vorticity.uniforms.dt.value = dt
      render(velocityState.current.write)
      swap(velocityState)
      applyBoundary(velocityState, true)
    }

    // --- STEP 3: Projection (Divergence -> Pressure -> Subtract) ---
    plane.material = materials.divergence
    materials.divergence.uniforms.velocity.value = velocityState.current.read.texture
    render(divergence)

    plane.material = materials.pressure
    materials.pressure.uniforms.divergence.value = divergence.texture
    for (let i = 0; i < currentConfig.pressureIterations; i++) {
      materials.pressure.uniforms.pressure.value = pressureState.current.read.texture
      render(pressureState.current.write)
      swap(pressureState)
      // 【重要】圧力場は常にNeumann (Open=BC_NEUMANN) を適用する
      applyBoundary(pressureState, false)
    }

    plane.material = materials.gradientSubtract
    materials.gradientSubtract.uniforms.pressure.value = pressureState.current.read.texture
    materials.gradientSubtract.uniforms.velocity.value = velocityState.current.read.texture
    render(velocityState.current.write)
    swap(velocityState)
    applyBoundary(velocityState, true)

    // --- STEP 4: Density Advection ---
    plane.material = materials.advection
    materials.advection.uniforms.velocity.value = velocityState.current.read.texture
    materials.advection.uniforms.source.value = densityState.current.read.texture
    materials.advection.uniforms.dissipation.value = currentConfig.densityDissipation
    materials.advection.uniforms.dt.value = dt
    render(densityState.current.write)
    swap(densityState)
    applyBoundary(densityState, false)

    // Density Input (Mouse)
    if (isDragging.current) {
      const x = pointer.x * 0.5 + 0.5
      const y = pointer.y * 0.5 + 0.5
      plane.material = materials.splat
      materials.splat.uniforms.uTarget.value = densityState.current.read.texture
      // スカラー値をRGBにコピーしてグレースケールとして扱う
      const val = currentConfig.splatDensity
      materials.splat.uniforms.color.value.set(val, val, val) 
      materials.splat.uniforms.point.value.set(x, y)
      materials.splat.uniforms.radius.value = currentConfig.splatRadius
      render(densityState.current.write)
      swap(densityState)
      applyBoundary(densityState, false)
    }

    // --- Display ---
    gl.setRenderTarget(null)
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uDensity.value = densityState.current.read.texture
      material.uniforms.uVelocity.value = velocityState.current.read.texture
      material.uniforms.uCurl.value = curl.texture
      material.uniforms.uPressure.value = pressureState.current.read.texture
      
      material.uniforms.uMode.value = currentConfig.mode
      material.uniforms.uColorA.value.set(currentConfig.colorA)
      material.uniforms.uColorB.value.set(currentConfig.colorB)
      material.uniforms.uBias.value = currentConfig.bias
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={displayShader}
        uniforms={{
          uDensity: { value: density1.texture },
          uVelocity: { value: velocity1.texture },
          uCurl: { value: curl.texture },
          uPressure: { value: pressure1.texture },
          uMode: { value: 0 },
          uColorA: { value: new THREE.Color(config.colorA) },
          uColorB: { value: new THREE.Color(config.colorB) },
          uBias: { value: 1.0 }
        }}
        depthWrite={false}
        depthTest={false}
        key={`${config.colorA}-${config.colorB}-${config.bias}`}
      />
    </mesh>
  )
}