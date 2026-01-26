"use client"

import { useState, useEffect } from "react"
import { MacWindow } from "./mac-window"

interface StyleEditorProps {
  onClose: () => void
  zIndex: number
  onFocus: () => void
}

interface ThemeColors {
  background: string
  card: string
  primary: string
  secondary: string
  border: string
}

const presetThemes: { name: string; colors: ThemeColors }[] = [
  {
    name: "Classic",
    colors: {
      background: "#0000aa",
      card: "#c0c0c0",
      primary: "#000080",
      secondary: "#dfdfdf",
      border: "#000000",
    },
  },
  {
    name: "Platinum",
    colors: {
      background: "#666699",
      card: "#dddddd",
      primary: "#333366",
      secondary: "#eeeeee",
      border: "#000000",
    },
  },
  {
    name: "Hot Dog Stand",
    colors: {
      background: "#ff0000",
      card: "#ffff00",
      primary: "#ff0000",
      secondary: "#ffff00",
      border: "#000000",
    },
  },
  {
    name: "Noir",
    colors: {
      background: "#1a1a1a",
      card: "#333333",
      primary: "#000000",
      secondary: "#444444",
      border: "#666666",
    },
  },
  {
    name: "Forest",
    colors: {
      background: "#2d5a27",
      card: "#c8d5bb",
      primary: "#1a3518",
      secondary: "#dde5d5",
      border: "#000000",
    },
  },
]

export function StyleEditor({ onClose, zIndex, onFocus }: StyleEditorProps) {
  const [colors, setColors] = useState<ThemeColors>({
    background: "#0000aa",
    card: "#c0c0c0",
    primary: "#000080",
    secondary: "#dfdfdf",
    border: "#000000",
  })

  useEffect(() => {
    // Load current theme from CSS variables
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    setColors({
      background: computedStyle.getPropertyValue("--background").trim() || "#0000aa",
      card: computedStyle.getPropertyValue("--card").trim() || "#c0c0c0",
      primary: computedStyle.getPropertyValue("--primary").trim() || "#000080",
      secondary: computedStyle.getPropertyValue("--secondary").trim() || "#dfdfdf",
      border: computedStyle.getPropertyValue("--border").trim() || "#000000",
    })
  }, [])

  const applyColors = (newColors: ThemeColors) => {
    const root = document.documentElement
    root.style.setProperty("--background", newColors.background)
    root.style.setProperty("--card", newColors.card)
    root.style.setProperty("--popover", newColors.card)
    root.style.setProperty("--primary", newColors.primary)
    root.style.setProperty("--accent", newColors.primary)
    root.style.setProperty("--secondary", newColors.secondary)
    root.style.setProperty("--border", newColors.border)
    root.style.setProperty("--sidebar", newColors.card)
    root.style.setProperty("--sidebar-primary", newColors.primary)
    root.style.setProperty("--sidebar-accent", newColors.secondary)
    root.style.setProperty("--sidebar-border", newColors.border)
    setColors(newColors)
  }

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...colors, [key]: value }
    applyColors(newColors)
  }

  const applyPreset = (preset: ThemeColors) => {
    applyColors(preset)
  }

  return (
    <MacWindow
      title="Style Editor"
      className="w-80"
      onClose={onClose}
      draggable
      initialPosition={{ x: 300, y: 60 }}
      zIndex={zIndex}
      onFocus={onFocus}
      canMinimize
    >
      <div className="flex flex-col gap-4">
        {/* Preset Themes */}
        <div className="flex flex-col gap-2">
          <label className="text-card-foreground font-bold">Preset Themes:</label>
          <div className="flex flex-wrap gap-2">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.colors)}
                className="px-2 py-1 bg-secondary text-card-foreground border-2 border-border text-sm hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-border" />

        {/* Custom Colors */}
        <div className="flex flex-col gap-3">
          <label className="text-card-foreground font-bold">Custom Colors:</label>
          
          <div className="flex items-center justify-between">
            <span className="text-card-foreground text-sm">Desktop:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.background}
                onChange={(e) => handleColorChange("background", e.target.value)}
                className="w-8 h-6 border-2 border-border cursor-pointer"
              />
              <span className="text-card-foreground text-xs font-mono">{colors.background}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-card-foreground text-sm">Window:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.card}
                onChange={(e) => handleColorChange("card", e.target.value)}
                className="w-8 h-6 border-2 border-border cursor-pointer"
              />
              <span className="text-card-foreground text-xs font-mono">{colors.card}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-card-foreground text-sm">Title Bar:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="w-8 h-6 border-2 border-border cursor-pointer"
              />
              <span className="text-card-foreground text-xs font-mono">{colors.primary}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-card-foreground text-sm">Buttons:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="w-8 h-6 border-2 border-border cursor-pointer"
              />
              <span className="text-card-foreground text-xs font-mono">{colors.secondary}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-card-foreground text-sm">Border:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.border}
                onChange={(e) => handleColorChange("border", e.target.value)}
                className="w-8 h-6 border-2 border-border cursor-pointer"
              />
              <span className="text-card-foreground text-xs font-mono">{colors.border}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-border" />

        {/* Reset Button */}
        <button
          onClick={() => applyPreset(presetThemes[0].colors)}
          className="px-3 py-2 bg-secondary text-card-foreground border-2 border-border text-sm hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
        >
          Reset to Default
        </button>
      </div>
    </MacWindow>
  )
}
