"use client"

import { useState, useEffect, useCallback } from "react"

interface Toaster {
  id: number
  x: number
  y: number
  speed: number
  wingFrame: number
  size: number
}

interface Toast {
  id: number
  x: number
  y: number
  speed: number
  rotation: number
}

interface FlyingToastersProps {
  onClose: () => void
}

function PixelToaster({ wingFrame, size }: { wingFrame: number; size: number }) {
  const wingUp = wingFrame % 2 === 0
  
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="drop-shadow-lg">
      {/* Toaster body */}
      <rect x="8" y="16" width="32" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
      <rect x="10" y="18" width="28" height="8" fill="#404040" />
      {/* Slots */}
      <rect x="14" y="20" width="8" height="4" fill="#000" />
      <rect x="26" y="20" width="8" height="4" fill="#000" />
      {/* Lever */}
      <rect x="38" y="24" width="4" height="8" fill="#808080" stroke="#000" strokeWidth="1" />
      {/* Base */}
      <rect x="6" y="38" width="36" height="4" fill="#808080" stroke="#000" strokeWidth="1" />
      {/* Wings */}
      {wingUp ? (
        <>
          <path d="M4 12 L8 20 L16 16 Z" fill="#fff" stroke="#000" strokeWidth="1" />
          <path d="M44 12 L40 20 L32 16 Z" fill="#fff" stroke="#000" strokeWidth="1" />
        </>
      ) : (
        <>
          <path d="M4 24 L8 20 L16 24 Z" fill="#fff" stroke="#000" strokeWidth="1" />
          <path d="M44 24 L40 20 L32 24 Z" fill="#fff" stroke="#000" strokeWidth="1" />
        </>
      )}
      {/* Shine */}
      <rect x="12" y="28" width="4" height="8" fill="#fff" opacity="0.3" />
    </svg>
  )
}

function PixelToast({ rotation, size }: { rotation: number; size: number }) {
  return (
    <svg 
      viewBox="0 0 24 28" 
      width={size * 0.5} 
      height={size * 0.6} 
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Toast slice */}
      <path 
        d="M2 4 Q2 2 4 2 L20 2 Q22 2 22 4 L22 24 Q22 26 20 26 L4 26 Q2 26 2 24 Z" 
        fill="#d4a574" 
        stroke="#8b6914" 
        strokeWidth="1" 
      />
      {/* Crust edge */}
      <path 
        d="M4 4 L20 4 L20 22 L4 22 Z" 
        fill="#f4d9a4" 
      />
      {/* Burn marks */}
      <ellipse cx="8" cy="10" rx="2" ry="1" fill="#8b4513" opacity="0.6" />
      <ellipse cx="14" cy="14" rx="3" ry="1.5" fill="#8b4513" opacity="0.5" />
      <ellipse cx="10" cy="18" rx="2" ry="1" fill="#8b4513" opacity="0.4" />
    </svg>
  )
}

export function FlyingToasters({ onClose }: FlyingToastersProps) {
  const [toasters, setToasters] = useState<Toaster[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize toasters and toasts
  useEffect(() => {
    if (dimensions.width === 0) return
    
    const initialToasters: Toaster[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height - dimensions.height,
      speed: 1 + Math.random() * 2,
      wingFrame: Math.floor(Math.random() * 4),
      size: 48 + Math.random() * 32
    }))
    
    const initialToasts: Toast[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height - dimensions.height,
      speed: 2 + Math.random() * 3,
      rotation: Math.random() * 360
    }))
    
    setToasters(initialToasters)
    setToasts(initialToasts)
  }, [dimensions])

  // Animation loop
  useEffect(() => {
    if (dimensions.width === 0) return
    
    const interval = setInterval(() => {
      setToasters(prev => prev.map(toaster => {
        let newY = toaster.y + toaster.speed * 2
        let newX = toaster.x - toaster.speed * 1.5
        
        // Reset position when off screen
        if (newY > dimensions.height + 100 || newX < -100) {
          newY = -100
          newX = dimensions.width + Math.random() * 200
        }
        
        return {
          ...toaster,
          x: newX,
          y: newY,
          wingFrame: toaster.wingFrame + 1
        }
      }))
      
      setToasts(prev => prev.map(toast => {
        let newY = toast.y + toast.speed * 2.5
        let newX = toast.x - toast.speed * 1.2
        
        if (newY > dimensions.height + 50 || newX < -50) {
          newY = -50 - Math.random() * 200
          newX = dimensions.width + Math.random() * 100
        }
        
        return {
          ...toast,
          x: newX,
          y: newY,
          rotation: toast.rotation + toast.speed
        }
      }))
    }, 50)
    
    return () => clearInterval(interval)
  }, [dimensions])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black cursor-pointer overflow-hidden"
      onClick={onClose}
    >
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          />
        ))}
      </div>
      
      {/* Flying toasts */}
      {toasts.map(toast => (
        <div
          key={`toast-${toast.id}`}
          className="absolute"
          style={{
            left: toast.x,
            top: toast.y,
            transition: "none"
          }}
        >
          <PixelToast rotation={toast.rotation} size={40} />
        </div>
      ))}
      
      {/* Flying toasters */}
      {toasters.map(toaster => (
        <div
          key={`toaster-${toaster.id}`}
          className="absolute"
          style={{
            left: toaster.x,
            top: toaster.y,
            transition: "none"
          }}
        >
          <PixelToaster wingFrame={toaster.wingFrame} size={toaster.size} />
        </div>
      ))}
      
      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-xl opacity-50 font-mono">
        Click anywhere or press ESC to exit
      </div>
      
      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-2xl font-bold font-mono tracking-wider">
        FLYING TOASTERS
      </div>
    </div>
  )
}
