"use client"

import { useState, useEffect } from "react"

interface MenuBarProps {
  onGioPromptClick?: () => void
  onFileClick?: () => void
  onEditClick?: () => void
  onSpecialClick?: () => void
}

export function MenuBar({ onGioPromptClick, onFileClick, onEditClick, onSpecialClick }: MenuBarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between bg-card border-b-2 border-border px-3 py-1 flex-shrink-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onGioPromptClick}
          className="font-bold text-lg border border-border px-2 bg-secondary text-card-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
        >
          GioPrompt
        </button>
        <button 
          onClick={onFileClick}
          className="text-card-foreground hover:bg-primary hover:text-primary-foreground px-2 cursor-pointer bg-transparent border-none"
        >
          File
        </button>
        <button 
          onClick={onEditClick}
          className="text-card-foreground hover:bg-primary hover:text-primary-foreground px-2 cursor-pointer bg-transparent border-none"
        >
          Edit
        </button>
        <button 
          onClick={onSpecialClick}
          className="text-card-foreground hover:bg-primary hover:text-primary-foreground px-2 cursor-pointer bg-transparent border-none"
        >
          Special
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-card-foreground text-lg">{time}</span>
      </div>
    </div>
  )
}
