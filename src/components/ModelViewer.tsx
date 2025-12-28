'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Maximize2, Minimize2, RotateCw } from 'lucide-react'

interface ModelViewerProps {
  modelUrl: string
  fileFormat: 'stl' | 'obj' | 'gltf' | 'glb'
  className?: string
}

function Model() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4F46E5" />
    </mesh>
  )
}

export default function ModelViewer({
  modelUrl,
  fileFormat,
  className = ''
}: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
      {/* 3D Canvas */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Model />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          className="bg-white/90 hover:bg-white p-2 rounded-md shadow-lg transition-colors"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-2 rounded z-20">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
