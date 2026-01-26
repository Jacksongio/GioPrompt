"use client"

import { MacWindow } from "./mac-window"
import { useState, useEffect } from "react"

interface SystemInfoProps {
  onClose: () => void
  zIndex: number
  onFocus: () => void
}

export function SystemInfo({ onClose, zIndex, onFocus }: SystemInfoProps) {
  const [uptime, setUptime] = useState(0)
  const [memoryUsed, setMemoryUsed] = useState(0)

  useEffect(() => {
    // Simulate uptime counter
    const interval = setInterval(() => {
      setUptime(prev => prev + 1)
    }, 1000)

    // Simulate memory usage fluctuation
    const memInterval = setInterval(() => {
      setMemoryUsed(Math.floor(Math.random() * 20) + 60) // 60-80%
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(memInterval)
    }
  }, [])

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <MacWindow
      title="About This GioPrompt"
      className="w-96"
      onClose={onClose}
      draggable
      initialPosition={{ x: 180, y: 60 }}
      onFocus={onFocus}
      zIndex={zIndex}
      canMinimize
    >
      <div className="flex flex-col gap-4">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 pb-4 border-b-2 border-border">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent border-2 border-border flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-14 h-14">
              <rect x="4" y="4" width="32" height="32" fill="#c0c0c0" stroke="#000" strokeWidth="2" rx="2" />
              <rect x="8" y="8" width="24" height="16" fill="#000080" />
              <text x="20" y="20" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">Gio</text>
              <rect x="10" y="28" width="8" height="4" fill="#808080" />
              <rect x="22" y="28" width="8" height="4" fill="#808080" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">GioPrompt OS</h2>
            <p className="text-sm text-muted-foreground">Version 1.0.26</p>
            <p className="text-sm text-muted-foreground">Build 2026.01.26</p>
          </div>
        </div>

        {/* System Specs */}
        <div className="flex flex-col gap-2 text-card-foreground">
          <div className="flex justify-between border-b border-border pb-1">
            <span className="font-bold">Processor:</span>
            <span>GioChip M1 Ultra</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span className="font-bold">Memory:</span>
            <span>640 KB (Should be enough)</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span className="font-bold">Storage:</span>
            <span>Unlimited Cloud</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span className="font-bold">Graphics:</span>
            <span>Pixel Perfect 32-bit</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span className="font-bold">Display:</span>
            <span>Retro HD</span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="bg-secondary border-2 border-border p-3">
          <h3 className="font-bold text-card-foreground mb-2">Live System Status</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-card-foreground">
              <span>Session Uptime:</span>
              <span className="font-mono">{formatUptime(uptime)}</span>
            </div>
            <div className="flex justify-between text-card-foreground">
              <span>Memory Usage:</span>
              <span>{memoryUsed}%</span>
            </div>
            <div className="w-full bg-card border border-border h-4 mt-1">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${memoryUsed}%` }}
              />
            </div>
            <div className="flex justify-between text-card-foreground">
              <span>Prompts Optimized:</span>
              <span>Infinite</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t-2 border-border pt-3">
          <p>GioPrompt Systems Inc.</p>
          <p>"Making AI Prompts Great Since 2026"</p>
          <p className="mt-2 text-xs">Serial: GP-2026-AWESOME-EDITION</p>
        </div>
      </div>
    </MacWindow>
  )
}
