'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stage } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2, RotateCw } from 'lucide-react'

interface ModelViewerProps {
  modelUrl: string
  fileFormat: 'stl' | 'obj' | 'gltf' | 'glb'
  className?: string
}

function Model({ url, format }: { url: string; format: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [object, setObject] = useState<THREE.Group | null>(null)

  useEffect(() => {
    if (format === 'stl') {
      const loader = new STLLoader()
      loader.load(
        url,
        (geo) => {
          setGeometry(geo)
        },
        undefined,
        (error) => {
          console.error('Error loading STL:', error)
        }
      )
    } else if (format === 'obj') {
      const loader = new OBJLoader()
      loader.load(
        url,
        (obj) => {
          setObject(obj)
        },
        undefined,
        (error) => {
          console.error('Error loading OBJ:', error)
        }
      )
    } else if (format === 'gltf' || format === 'glb') {
      const loader = new GLTFLoader()
      loader.load(
        url,
        (gltf) => {
          setObject(gltf.scene)
        },
        undefined,
        (error) => {
          console.error('Error loading GLTF:', error)
        }
      )
    }
  }, [url, format])

  if (geometry) {
    return (
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#888888" />
      </mesh>
    )
  }

  if (object) {
    return <primitive object={object} />
  }

  return null
}

export default function ModelViewer({
  modelUrl,
  fileFormat,
  className = ''
}: ModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  const resetCamera = () => {
    // Reset camera position - trigger by changing key
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 100)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      style={{ height: isFullscreen ? '100vh' : '500px' }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-white text-lg">Loading 3D model...</div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        className="w-full h-full"
        onCreated={() => setIsLoading(false)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        <Stage
          intensity={0.5}
          environment="city"
          shadows={{
            type: 'contact',
            opacity: 0.4,
            blur: 2,
          }}
        >
          <Model url={modelUrl} format={fileFormat} />
        </Stage>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
          autoRotate={false}
        />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={resetCamera}
          title="Reset camera"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-2 rounded z-20">
        Click and drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
