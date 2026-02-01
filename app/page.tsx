"use client"

import { useState, useCallback, useEffect } from "react"
import { MenuBar } from "@/components/menu-bar"
import { DesktopIcon } from "@/components/desktop-icon"
import { MacWindow } from "@/components/mac-window"
import { PromptOptimizerContent } from "@/components/prompt-optimizer"
import { StyleEditor } from "@/components/style-editor"
import { FlyingToasters } from "@/components/flying-toasters"
import { FileManager } from "@/components/file-manager"
import { SystemInfo } from "@/components/system-info"

type WindowId = "optimizer" | "about" | "help" | "styleEditor" | "fileManager" | "systemInfo"

// Pixel art style icons as SVG
function PromptIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
      <rect x="8" y="8" width="16" height="2" fill="#000" />
      <rect x="8" y="12" width="12" height="2" fill="#000" />
      <rect x="8" y="16" width="14" height="2" fill="#000" />
      <rect x="8" y="20" width="10" height="2" fill="#000" />
    </svg>
  )
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
      <circle cx="16" cy="12" r="3" fill="#000080" />
      <rect x="14" y="17" width="4" height="8" fill="#000080" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="8" y="8" width="16" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
      <rect x="6" y="6" width="20" height="4" fill="#808080" stroke="#000" strokeWidth="1" />
      <line x1="12" y1="12" x2="12" y2="24" stroke="#000" strokeWidth="2" />
      <line x1="16" y1="12" x2="16" y2="24" stroke="#000" strokeWidth="2" />
      <line x1="20" y1="12" x2="20" y2="24" stroke="#000" strokeWidth="2" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="4" width="24" height="24" fill="#ffff00" stroke="#000" strokeWidth="2" />
      <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#000">?</text>
    </svg>
  )
}

// Easter Egg Icons
function FloppyIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="2" width="24" height="28" fill="#1e40af" stroke="#000" strokeWidth="2" />
      <rect x="8" y="2" width="14" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
      <rect x="10" y="4" width="8" height="6" fill="#404040" />
      <rect x="8" y="18" width="16" height="10" fill="#f0f0f0" stroke="#000" strokeWidth="1" />
      <rect x="10" y="20" width="12" height="2" fill="#808080" />
      <rect x="10" y="24" width="8" height="2" fill="#808080" />
    </svg>
  )
}

function ToasterIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="10" width="24" height="16" rx="2" fill="#c0c0c0" stroke="#000" strokeWidth="2" />
      <rect x="8" y="6" width="6" height="8" fill="#d4a574" stroke="#000" strokeWidth="1" />
      <rect x="18" y="6" width="6" height="8" fill="#d4a574" stroke="#000" strokeWidth="1" />
      <rect x="10" y="8" width="2" height="4" fill="#8b6914" />
      <rect x="20" y="8" width="2" height="4" fill="#8b6914" />
      <circle cx="24" cy="18" r="2" fill="#ff0000" />
    </svg>
  )
}

function BombIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <circle cx="16" cy="18" r="10" fill="#000" />
      <rect x="14" y="4" width="4" height="8" fill="#808080" />
      <path d="M18 6 L24 2 L22 6 L26 4" stroke="#ff6600" strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="14" rx="3" ry="2" fill="#404040" />
    </svg>
  )
}

function SadMacIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="4" y="2" width="24" height="28" rx="2" fill="#f0f0f0" stroke="#000" strokeWidth="2" />
      <rect x="8" y="6" width="16" height="12" fill="#000" />
      <rect x="10" y="8" width="4" height="3" fill="#fff" />
      <rect x="18" y="8" width="4" height="3" fill="#fff" />
      <path d="M12 14 Q16 12 20 14" stroke="#fff" strokeWidth="1" fill="none" />
      <rect x="10" y="22" width="12" height="4" fill="#c0c0c0" stroke="#000" strokeWidth="1" />
    </svg>
  )
}

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <rect x="6" y="10" width="16" height="18" fill="#fff" stroke="#000" strokeWidth="2" />
      <path d="M22 14 Q28 14 28 20 Q28 26 22 26" stroke="#000" strokeWidth="2" fill="none" />
      <rect x="8" y="12" width="12" height="8" fill="#6b4423" />
      <path d="M10 6 Q12 2 14 6" stroke="#808080" strokeWidth="1" fill="none" />
      <path d="M14 4 Q16 0 18 4" stroke="#808080" strokeWidth="1" fill="none" />
    </svg>
  )
}

export default function Home() {
  const [showOptimizer, setShowOptimizer] = useState(true)
  const [showAbout, setShowAbout] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [showScreensaver, setShowScreensaver] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [showSystemInfo, setShowSystemInfo] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [windowOrder, setWindowOrder] = useState<WindowId[]>(["optimizer", "about", "help", "styleEditor", "fileManager", "systemInfo"])
  const [rightSideX, setRightSideX] = useState(1200)
  const [trashPosition, setTrashPosition] = useState({ x: 1200, y: 600 })
  const [bottomLeftPositions, setBottomLeftPositions] = useState({ 
    bomb: { x: 8, y: 600 }, 
    sadmac: { x: 8, y: 684 } 
  })
  
  // Helper function to snap to grid (same logic as in DesktopIcon)
  const snapToGrid = useCallback((x: number, y: number) => {
    const GRID_SIZE_X = 90
    const GRID_SIZE_Y = 84
    const GRID_OFFSET_X = 8
    const GRID_OFFSET_Y = 8
    const gridX = Math.round((x - GRID_OFFSET_X) / GRID_SIZE_X)
    const gridY = Math.round((y - GRID_OFFSET_Y) / GRID_SIZE_Y)
    return {
      x: Math.max(0, gridX) * GRID_SIZE_X + GRID_OFFSET_X,
      y: Math.max(0, gridY) * GRID_SIZE_Y + GRID_OFFSET_Y
    }
  }, [])
  
  // Initialize icon positions with their snapped initial positions
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() => ({
    prompt: snapToGrid(16, 16),
    about: snapToGrid(16, 100),
    help: snapToGrid(16, 184),
  }))

  useEffect(() => {
    const updatePositions = () => {
      // Set right side icon positions and trash position
      const newRightX = window.innerWidth - 100
      const newTrashPos = { x: window.innerWidth - 100, y: window.innerHeight - 150 }
      
      // Calculate bottom left positions
      const newBombPos = { x: 8, y: window.innerHeight - 234 } // 150 + 84 (one grid cell up from trash)
      const newSadmacPos = { x: 8, y: window.innerHeight - 150 }
      
      setRightSideX(newRightX)
      setTrashPosition(newTrashPos)
      setBottomLeftPositions({
        bomb: newBombPos,
        sadmac: newSadmacPos
      })
      
      // Also register their positions in the icon positions map
      setIconPositions(prev => ({
        ...prev,
        floppy: snapToGrid(newRightX, 16),
        toaster: snapToGrid(newRightX, 100),
        coffee: snapToGrid(newRightX, 184),
        trash: snapToGrid(newTrashPos.x, newTrashPos.y),
        bomb: snapToGrid(newBombPos.x, newBombPos.y),
        sadmac: snapToGrid(newSadmacPos.x, newSadmacPos.y)
      }))
    }

    // Initial positioning
    updatePositions()

    // Add resize listener for responsive behavior
    window.addEventListener('resize', updatePositions)
    
    return () => {
      window.removeEventListener('resize', updatePositions)
    }
  }, [snapToGrid])

  const bringToFront = useCallback((windowId: WindowId) => {
    setWindowOrder(prev => {
      const filtered = prev.filter(id => id !== windowId)
      return [...filtered, windowId]
    })
  }, [])

  const getZIndex = (windowId: WindowId) => {
    return windowOrder.indexOf(windowId) + 10
  }

  const handleIconPositionChange = useCallback((iconId: string, position: { x: number; y: number }) => {
    setIconPositions(prev => ({
      ...prev,
      [iconId]: position
    }))
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Menu Bar */}
      <MenuBar 
        onGioPromptClick={() => {
          setShowSystemInfo(true)
          bringToFront("systemInfo")
        }}
        onFileClick={() => {
          setShowFileManager(true)
          bringToFront("fileManager")
        }}
        onEditClick={() => {
          setShowStyleEditor(true)
          bringToFront("styleEditor")
        }}
        onSpecialClick={() => setShowScreensaver(true)}
      />

      {/* Desktop Area */}
      <main className="flex-1 relative p-4 overflow-hidden">
        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src="/gioprompt.png" 
            alt="GioPrompt Logo" 
            className="max-w-[40%] max-h-[40%] object-contain"
          />
        </div>

        {/* Desktop Icons - all draggable */}
        <DesktopIcon
          icon={<PromptIcon />}
          label="GioPrompt"
          selected={selectedIcon === "prompt"}
          onClick={() => setSelectedIcon("prompt")}
          onDoubleClick={() => {
            setSelectedIcon("prompt")
            setShowOptimizer(true)
            bringToFront("optimizer")
          }}
          initialPosition={{ x: 16, y: 16 }}
          iconId="prompt"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<AboutIcon />}
          label="About"
          selected={selectedIcon === "about"}
          onClick={() => setSelectedIcon("about")}
          onDoubleClick={() => {
            setSelectedIcon("about")
            setShowAbout(true)
            bringToFront("about")
          }}
          initialPosition={{ x: 16, y: 100 }}
          iconId="about"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<HelpIcon />}
          label="Help"
          selected={selectedIcon === "help"}
          onClick={() => setSelectedIcon("help")}
          onDoubleClick={() => {
            setSelectedIcon("help")
            setShowHelp(true)
            bringToFront("help")
          }}
          initialPosition={{ x: 16, y: 184 }}
          iconId="help"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<TrashIcon />}
          label="Trash"
          selected={selectedIcon === "trash"}
          onClick={() => setSelectedIcon("trash")}
          initialPosition={trashPosition}
          iconId="trash"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />

        {/* Easter Egg Icons - Bottom Left */}
        <DesktopIcon
          icon={<BombIcon />}
          label="dont_click"
          selected={selectedIcon === "bomb"}
          onClick={() => setSelectedIcon("bomb")}
          onDoubleClick={() => {
            setSelectedIcon("bomb")
            const el = document.documentElement
            el.style.transition = "transform 0.5s"
            el.style.transform = "rotate(2deg)"
            setTimeout(() => {
              el.style.transform = "rotate(-2deg)"
            }, 500)
            setTimeout(() => {
              el.style.transform = "rotate(0deg)"
            }, 1000)
          }}
          initialPosition={bottomLeftPositions.bomb}
          iconId="bomb"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<SadMacIcon />}
          label="System 404"
          selected={selectedIcon === "sadmac"}
          onClick={() => setSelectedIcon("sadmac")}
          onDoubleClick={() => {
            setSelectedIcon("sadmac")
            const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]
            let i = 0
            const interval = setInterval(() => {
              document.body.style.backgroundColor = colors[i % colors.length]
              i++
              if (i > 10) {
                clearInterval(interval)
                document.body.style.backgroundColor = ""
              }
            }, 100)
          }}
          initialPosition={bottomLeftPositions.sadmac}
          iconId="sadmac"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />

        {/* Easter Egg Icons - Right Side */}
        <DesktopIcon
          icon={<FloppyIcon />}
          label="secrets.dat"
          selected={selectedIcon === "floppy"}
          onClick={() => setSelectedIcon("floppy")}
          onDoubleClick={() => {
            setSelectedIcon("floppy")
            alert("[ DATA CORRUPTED ]\n\nJust kidding! Thanks for exploring.")
          }}
          initialPosition={{ x: rightSideX, y: 16 }}
          iconId="floppy"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<ToasterIcon />}
          label="Toaster.app"
          selected={selectedIcon === "toaster"}
          onClick={() => setSelectedIcon("toaster")}
          onDoubleClick={() => {
            setSelectedIcon("toaster")
            setShowScreensaver(true)
          }}
          initialPosition={{ x: rightSideX, y: 100 }}
          iconId="toaster"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />
        <DesktopIcon
          icon={<CoffeeIcon />}
          label="Coffee Break"
          selected={selectedIcon === "coffee"}
          onClick={() => setSelectedIcon("coffee")}
          onDoubleClick={() => {
            setSelectedIcon("coffee")
            document.body.style.filter = "sepia(0.5) brightness(1.1)"
            setTimeout(() => {
              document.body.style.filter = ""
            }, 2000)
          }}
          initialPosition={{ x: rightSideX, y: 184 }}
          iconId="coffee"
          occupiedPositions={iconPositions}
          onPositionChange={handleIconPositionChange}
        />

        {/* Draggable Windows */}
        {showOptimizer && (
          <MacWindow
            title="GioPrompt v1.0 - Prompt Optimizer"
            className="w-full sm:w-[calc(100vw-140px)] sm:max-w-[1400px]"
            onClose={() => setShowOptimizer(false)}
            draggable
            resizable
            initialPosition={{ x: 120, y: 60 }}
            onFocus={() => bringToFront("optimizer")}
            zIndex={getZIndex("optimizer")}
            canMaximize
            centerOnMount
          >
            <PromptOptimizerContent />
          </MacWindow>
        )}

        {showAbout && (
          <MacWindow
            title="About GioPrompt"
            className="w-full sm:w-80"
            onClose={() => setShowAbout(false)}
            draggable
            initialPosition={{ x: 200, y: 120 }}
            onFocus={() => bringToFront("about")}
            zIndex={getZIndex("about")}
            canMaximize
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-primary border-2 border-border flex items-center justify-center">
                <span className="text-3xl text-primary-foreground font-bold">G</span>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">GioPrompt v1.0</h2>
              <p className="text-card-foreground">
                The ultimate AI prompt optimization tool for the modern creative.
              </p>
              <div className="border-t-2 border-border pt-4 w-full">
                <p className="text-sm text-muted-foreground">
                  Transform your basic prompts into powerful, optimized instructions
                  tailored for video, text, image, code, and music generation.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">© 2026 GioPrompt Systems</p>
            </div>
          </MacWindow>
        )}

        {showHelp && (
          <MacWindow
            title="Help"
            className="w-full sm:w-96"
            onClose={() => setShowHelp(false)}
            draggable
            initialPosition={{ x: 250, y: 140 }}
            onFocus={() => bringToFront("help")}
            zIndex={getZIndex("help")}
            canMaximize
          >
            <div className="flex flex-col gap-4 text-card-foreground">
              <h3 className="text-xl font-bold border-b-2 border-border pb-2">How to Use GioPrompt</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select your generation type (Text, Image, Video, Code, or Music)</li>
                <li>Enter your basic prompt in the input field</li>
                <li>Click "Optimize Prompt" to transform it</li>
                <li>Copy the optimized prompt to use with your AI tool</li>
              </ol>
              <div className="bg-secondary border-2 border-border p-3 mt-2">
                <p className="font-bold">Pro Tip:</p>
                <p className="text-sm">The more detail you provide in your original prompt, the better the optimized output will be!</p>
              </div>
            </div>
          </MacWindow>
        )}

        {showStyleEditor && (
          <StyleEditor
            onClose={() => setShowStyleEditor(false)}
            zIndex={getZIndex("styleEditor")}
            onFocus={() => bringToFront("styleEditor")}
          />
        )}

        {showFileManager && (
          <FileManager
            onClose={() => setShowFileManager(false)}
            zIndex={getZIndex("fileManager")}
            onFocus={() => bringToFront("fileManager")}
          />
        )}

        {showSystemInfo && (
          <SystemInfo
            onClose={() => setShowSystemInfo(false)}
            zIndex={getZIndex("systemInfo")}
            onFocus={() => bringToFront("systemInfo")}
          />
        )}
      </main>

      {/* Status Bar - Fixed at bottom */}
      <div className="flex-shrink-0 bg-card border-t-2 border-border px-4 py-1 flex items-center justify-between">
        <span className="text-card-foreground text-sm">Ready</span>
        <span className="text-card-foreground text-sm">GioPrompt System v1.0</span>
      </div>

      {/* Flying Toasters Easter Egg */}
      {showScreensaver && (
        <FlyingToasters onClose={() => setShowScreensaver(false)} />
      )}
    </div>
  )
}
