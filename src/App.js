import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function Overlay({ ready, clicked, setClicked }) {
    return (
    <>
        <div className={`fullscreen bg ${ready ? 'ready' : 'notready'} ${clicked && 'clicked'}`}>
            <div onClick={() => ready && setClicked(true)}>{!ready ? 'loading' : 'click to continue'}</div>
        </div>    
    </>
    )
}

function IconModel(props) {
    const { scene } = useGLTF('./models/icon_base.glb')
    return <primitive object={scene} {...props} />
}
function IconFrontModel(props) {
    const { scene } = useGLTF('./models/icon_d.glb')
    return <primitive object={scene} {...props} />
}



function Ground() {
    const [floor, normal] = useTexture(['./SurfaceImperfections003_1K_var1.jpg', './SurfaceImperfections003_1K_Normal.jpg'])
    return (
      <Reflector blur={[400, 100]} resolution={512} args={[18, 18]} mirror={0.1} mixBlur={3} mixStrength={2.0} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
      </Reflector>
    )
}

function BigScreen({ clicked, ...props }) {
    const [video] = useState(() => Object.assign(document.createElement('video'), { src: './video/trailer_old.mp4', crossOrigin: 'Anonymous', loop: true, muted: true}))
    useEffect(() => void (clicked && video.play()), [video, clicked])
    return (
        <mesh position={[0, 1.5, -2]}>
        <planeGeometry args={[5, 5*(9/16)]}  {...props} />
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
        </meshBasicMaterial>
        </mesh>
    )
}

  export default function App() {
    const [clicked, setClicked] = useState(true)
    const [ready, setReady] = useState(false)
    const store = { clicked, setClicked, ready, setReady }
    const iconRef = useRef(null)
    const screenRef = useRef(null)
    return (
      <>
        <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 15}} >
          <color attach="background" args={['black']} />
          <fog attach="fog" args={['black', 15, 20]} />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]}>
                <group position={[0, 0.7, 0.6]} ref={iconRef}>
                    <IconModel />
                    <IconFrontModel />
                </group>                
                <BigScreen {...store} />                
              <Ground />
            </group>
            <ambientLight intensity={0.5} />
            <spotLight position={[0, 10, -2]} intensity={0.5} />
            <directionalLight position={[-20, 0, -10]} intensity={0.9} />
            <Intro start={ready && clicked} set={setReady} />
          </Suspense>
        </Canvas>
        <Overlay {...store} />
      </>
    )
  }
  
  function Intro({ start, set }) {
    const [vec] = useState(() => new THREE.Vector3())
    useEffect(() => setTimeout(() => set(true), 1000), [])
    return useFrame((state) => {
      if (start) {
        state.camera.position.lerp(vec.set(state.mouse.x * 5, state.mouse.y * 0.4, 14), 0.05)
        state.camera.lookAt(0, 0.2, 0)
      }
    })
  }
