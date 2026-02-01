"use client"

import { cn } from "@/lib/utils"
import { useState, useRef, useCallback, useEffect, type ReactNode, type MouseEvent } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MacWindowProps {
  title: string
  children: ReactNode
  className?: string
  onClose?: () => void
  resizable?: boolean
  maxHeight?: string
  draggable?: boolean
  initialPosition?: { x: number; y: number }
  onFocus?: () => void
  zIndex?: number
  canMinimize?: boolean
  canMaximize?: boolean
  centerOnMount?: boolean
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

// MenuBar height constant (includes border)
const MENU_BAR_HEIGHT = 42

export function MacWindow({ 
  title, 
  children, 
  className, 
  onClose, 
  resizable = false, 
  maxHeight,
  draggable = false,
  initialPosition = { x: 0, y: 0 },
  onFocus,
  zIndex = 1,
  canMinimize = false,
  canMaximize = false,
  centerOnMount = false
}: MacWindowProps) {
  const isMobile = useIsMobile()
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position: initialPosition, size: { width: 0, height: 0 }, wasSet: false })
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  // Center window on mobile when it mounts or when switching to mobile
  // Also center on desktop if centerOnMount is true
  useEffect(() => {
    if (isMobile && draggable) {
      const centerX = (window.innerWidth - (windowRef.current?.offsetWidth || 0)) / 2
      const centerY = (window.innerHeight - (windowRef.current?.offsetHeight || 0)) / 2
      setPosition({
        x: Math.max(8, centerX),
        y: Math.max(MENU_BAR_HEIGHT + 8, centerY)
      })
    } else if (centerOnMount && !isMobile && windowRef.current) {
      // Center on desktop when centerOnMount is true, positioned higher
      const centerX = (window.innerWidth - windowRef.current.offsetWidth) / 2
      const centerY = (window.innerHeight - windowRef.current.offsetHeight) / 2 - 120
      setPosition({
        x: Math.max(0, centerX),
        y: Math.max(MENU_BAR_HEIGHT, centerY)
      })
    }
  }, [isMobile, draggable, centerOnMount])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!draggable || isMobile) return // Disable dragging on mobile
    onFocus?.()
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      // Keep window within viewport bounds, but below the menu bar
      const maxX = window.innerWidth - 100
      const maxY = window.innerHeight - 100
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(MENU_BAR_HEIGHT, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [draggable, position, onFocus])

  const handleResizeStart = useCallback((e: MouseEvent, direction: ResizeDirection) => {
    if (!resizable || isMaximized || isMobile) return // Disable resizing on mobile
    e.stopPropagation()
    onFocus?.()
    
    const rect = windowRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsResizing(direction)
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      posX: position.x,
      posY: position.y
    }

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const deltaX = e.clientX - resizeStart.current.x
      const deltaY = e.clientY - resizeStart.current.y
      
      let newWidth = resizeStart.current.width
      let newHeight = resizeStart.current.height
      let newX = resizeStart.current.posX
      let newY = resizeStart.current.posY

      const minWidth = 320
      const minHeight = 200

      // Handle horizontal resizing
      if (direction?.includes('e')) {
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX)
      } else if (direction?.includes('w')) {
        const potentialWidth = resizeStart.current.width - deltaX
        if (potentialWidth >= minWidth) {
          newWidth = potentialWidth
          newX = resizeStart.current.posX + deltaX
        }
      }

      // Handle vertical resizing
      if (direction?.includes('s')) {
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY)
      } else if (direction?.includes('n')) {
        const potentialHeight = resizeStart.current.height - deltaY
        const potentialY = resizeStart.current.posY + deltaY
        // Don't allow resizing above the menu bar
        if (potentialHeight >= minHeight && potentialY >= MENU_BAR_HEIGHT) {
          newHeight = potentialHeight
          newY = potentialY
        }
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [resizable, isMaximized, position, onFocus])

  const handleWindowClick = () => {
    onFocus?.()
  }

  const handleMaximize = (e: MouseEvent) => {
    e.stopPropagation()
    if (!isMaximized) {
      setPreMaximizeState({ position, size, wasSet: true })
      setPosition({ x: 0, y: MENU_BAR_HEIGHT })
    } else if (preMaximizeState.wasSet) {
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    }
    setIsMaximized(!isMaximized)
  }

  return (
    <div 
      ref={windowRef}
      className={cn(
        "flex flex-col bg-card border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]", 
        resizable && !isMaximized && "min-w-[320px] min-h-[200px]",
        draggable && "absolute",
        isDragging && "cursor-grabbing select-none",
        // Apply custom className only when not maximized
        !isMaximized && className,
        // Desktop maximized: fullscreen
        isMaximized && !isMobile && `!fixed !w-screen !h-screen !left-0 !top-0`,
        // Mobile-specific styles
        isMobile && !isMaximized && `!fixed !w-[calc(100vw-16px)] !left-2`,
        // Mobile maximized: true fullscreen
        isMobile && isMaximized && `!fixed !w-screen !h-screen !left-0 !top-0 !border-0 !rounded-none`
      )}
      style={{ 
        ...(maxHeight && !isMaximized && !isMobile ? { maxHeight } : {}),
        ...(draggable && !isMobile && !isMaximized ? { 
          left: position.x, 
          top: position.y, 
          zIndex 
        } : {}),
        ...(size.width > 0 && !isMaximized && !isMobile ? { width: size.width } : {}),
        ...(size.height > 0 && !isMaximized && !isMobile ? { height: size.height } : {}),
        ...(isMaximized && !isMobile ? { 
          zIndex: 9999,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh'
        } : {}),
        ...(isMobile && !isMaximized ? { 
          zIndex,
          top: MENU_BAR_HEIGHT + 16,
          height: `calc(100vh - ${MENU_BAR_HEIGHT + 48}px)`
        } : {}),
        ...(isMobile && isMaximized ? {
          zIndex: 9999,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh'
        } : {})
      }}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div 
        className={cn(
          "flex items-center justify-between bg-primary px-2 py-1 border-b-2 border-border flex-shrink-0",
          draggable && !isMobile && "cursor-grab",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            className="w-4 h-4 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Close window"
          >
            <span className="text-[10px] leading-none text-card-foreground">x</span>
          </button>
          {canMaximize && (
            <button
              onClick={handleMaximize}
              className="w-4 h-4 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
            >
              <span className="text-[10px] leading-none text-card-foreground">{isMaximized ? "r" : "+"}</span>
            </button>
          )}
        </div>
        <span className="text-primary-foreground text-lg font-bold tracking-wide select-none">{title}</span>
        <div className="w-16" />
      </div>
      {/* Content */}
      <div className={cn(
        "flex-1 p-4 bg-card overflow-auto",
        isMaximized && "!h-[calc(100vh-50px)]"
      )}>
        {children}
      </div>
      {/* Resize Handles */}
      {resizable && !isMaximized && !isMobile && (
        <>
          {/* Edge Handles */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          
          {/* Corner Handles */}
          <div 
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div 
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div 
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div 
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Visual resize indicator (retro corner grip) */}
          <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none">
            <svg viewBox="0 0 16 16" className="w-full h-full">
              <line x1="14" y1="6" x2="6" y2="14" stroke="#808080" strokeWidth="2" />
              <line x1="14" y1="10" x2="10" y2="14" stroke="#808080" strokeWidth="2" />
              <line x1="14" y1="14" x2="14" y2="14" stroke="#808080" strokeWidth="2" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
