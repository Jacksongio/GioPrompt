"use client"

import { cn } from "@/lib/utils"
import { useState, useRef, useCallback, type ReactNode, type MouseEvent } from "react"

// Grid settings for snap-to-grid behavior
const GRID_SIZE_X = 90 // Width of each grid cell
const GRID_SIZE_Y = 84 // Height of each grid cell
const GRID_OFFSET_X = 8 // Left margin
const GRID_OFFSET_Y = 8 // Top margin (accounts for menu bar)

// Snap a position to the nearest grid cell
function snapToGrid(x: number, y: number): { x: number; y: number } {
  const gridX = Math.round((x - GRID_OFFSET_X) / GRID_SIZE_X)
  const gridY = Math.round((y - GRID_OFFSET_Y) / GRID_SIZE_Y)
  return {
    x: Math.max(0, gridX) * GRID_SIZE_X + GRID_OFFSET_X,
    y: Math.max(0, gridY) * GRID_SIZE_Y + GRID_OFFSET_Y
  }
}

interface DesktopIconProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  onDoubleClick?: () => void
  className?: string
  selected?: boolean
  initialPosition?: { x: number; y: number }
  draggable?: boolean
}

export function DesktopIcon({ 
  icon, 
  label, 
  onClick, 
  onDoubleClick,
  className, 
  selected,
  initialPosition,
  draggable = true
}: DesktopIconProps) {
  // Snap initial position to grid
  const snappedInitial = initialPosition ? snapToGrid(initialPosition.x, initialPosition.y) : { x: 0, y: 0 }
  const [position, setPosition] = useState(snappedInitial)
  const [dragPosition, setDragPosition] = useState(snappedInitial)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const [snapPreview, setSnapPreview] = useState(snappedInitial)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!draggable || !initialPosition) return
    
    e.preventDefault()
    setHasMoved(false)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setIsDragging(true)
      setHasMoved(true)
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      // Show live drag position
      setDragPosition({ x: newX, y: newY })
      // Calculate and show snap preview
      const maxX = window.innerWidth - GRID_SIZE_X
      const maxY = window.innerHeight - GRID_SIZE_Y - 40
      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))
      setSnapPreview(snapToGrid(clampedX, clampedY))
    }

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      const finalX = e.clientX - dragOffset.current.x
      const finalY = e.clientY - dragOffset.current.y
      // Snap to grid on release
      const maxX = window.innerWidth - GRID_SIZE_X
      const maxY = window.innerHeight - GRID_SIZE_Y - 40 // Account for footer
      const clampedX = Math.max(0, Math.min(finalX, maxX))
      const clampedY = Math.max(0, Math.min(finalY, maxY))
      const snapped = snapToGrid(clampedX, clampedY)
      setPosition(snapped)
      setDragPosition(snapped)
      setSnapPreview(snapped)
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [draggable, initialPosition, position])

  const handleClick = (e: MouseEvent) => {
    if (hasMoved) return
    
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      onDoubleClick?.()
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null
        onClick?.()
      }, 250)
    }
  }

  const iconElement = (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={cn(
        "flex flex-col items-center gap-1 p-2 w-20 text-center cursor-pointer transition-colors",
        selected ? "bg-primary" : "hover:bg-primary/20",
        isDragging && "opacity-70 cursor-grabbing",
        className
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className={cn(
        "text-sm leading-tight break-words select-none",
        selected ? "text-primary-foreground bg-primary px-1" : "text-foreground"
      )}>
        {label}
      </span>
    </button>
  )

  if (initialPosition) {
    const displayPos = isDragging ? dragPosition : position
    return (
      <>
        {/* Snap preview ghost - shows where icon will land */}
        {isDragging && (
          <div 
            className="absolute w-20 h-20 border-2 border-dashed border-primary/60 bg-primary/10 pointer-events-none"
            style={{ left: snapPreview.x, top: snapPreview.y }}
          />
        )}
        {/* Actual icon */}
        <div 
          className={cn(
            "absolute",
            isDragging ? "z-50" : "transition-all duration-150 ease-out"
          )}
          style={{ left: displayPos.x, top: displayPos.y }}
        >
          {iconElement}
        </div>
      </>
    )
  }

  return iconElement
}
