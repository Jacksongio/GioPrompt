"use client"

import { useState } from "react"

type PromptType = "text" | "image" | "video" | "code" | "music"

const promptTypeConfig: Record<PromptType, { label: string; icon: string; tips: string[] }> = {
  text: {
    label: "Text Generation",
    icon: "📝",
    tips: [
      "Be specific about tone and style",
      "Include context and background",
      "Specify desired length and format",
      "Add examples when possible",
    ],
  },
  image: {
    label: "Image Generation",
    icon: "🖼️",
    tips: [
      "Describe subject, style, and mood",
      "Include lighting and composition",
      "Specify art style (photorealistic, anime, etc.)",
      "Add camera angle and perspective",
    ],
  },
  video: {
    label: "Video Generation",
    icon: "🎬",
    tips: [
      "Describe scene transitions",
      "Include motion and action details",
      "Specify duration and pacing",
      "Add audio/music preferences",
    ],
  },
  code: {
    label: "Code Generation",
    icon: "💻",
    tips: [
      "Specify programming language",
      "Describe inputs and outputs",
      "Include error handling needs",
      "Mention performance requirements",
    ],
  },
  music: {
    label: "Music Generation",
    icon: "🎵",
    tips: [
      "Describe genre and mood",
      "Specify tempo and key",
      "Include instrument preferences",
      "Mention similar artists/songs",
    ],
  },
}

function optimizePrompt(prompt: string, type: PromptType): string {
  const config = promptTypeConfig[type]
  const lines: string[] = []

  switch (type) {
    case "text":
      lines.push(`[TASK] Generate high-quality written content`)
      lines.push(``)
      lines.push(`[CONTEXT]`)
      lines.push(prompt)
      lines.push(``)
      lines.push(`[INSTRUCTIONS]`)
      lines.push(`- Write in a clear, engaging style`)
      lines.push(`- Ensure proper grammar and punctuation`)
      lines.push(`- Structure content logically with clear flow`)
      lines.push(`- Adapt tone to match the content purpose`)
      break

    case "image":
      lines.push(`[IMAGE GENERATION PROMPT]`)
      lines.push(``)
      lines.push(`Subject: ${prompt}`)
      lines.push(``)
      lines.push(`Style: Highly detailed, professional quality`)
      lines.push(`Lighting: Cinematic, natural lighting with soft shadows`)
      lines.push(`Composition: Rule of thirds, balanced framing`)
      lines.push(`Quality: 8K resolution, sharp focus, high detail`)
      lines.push(`Mood: Vivid, atmospheric`)
      break

    case "video":
      lines.push(`[VIDEO GENERATION PROMPT]`)
      lines.push(``)
      lines.push(`Scene Description:`)
      lines.push(prompt)
      lines.push(``)
      lines.push(`Technical Specifications:`)
      lines.push(`- Smooth camera movements`)
      lines.push(`- Cinematic transitions between scenes`)
      lines.push(`- High frame rate for fluid motion`)
      lines.push(`- Professional color grading`)
      lines.push(`- Ambient audio matching the scene mood`)
      break

    case "code":
      lines.push(`[CODE GENERATION REQUEST]`)
      lines.push(``)
      lines.push(`Objective:`)
      lines.push(prompt)
      lines.push(``)
      lines.push(`Requirements:`)
      lines.push(`- Write clean, well-documented code`)
      lines.push(`- Include helpful comments explaining logic`)
      lines.push(`- Follow best practices and design patterns`)
      lines.push(`- Handle edge cases and errors gracefully`)
      lines.push(`- Optimize for readability and maintainability`)
      break

    case "music":
      lines.push(`[MUSIC GENERATION PROMPT]`)
      lines.push(``)
      lines.push(`Description:`)
      lines.push(prompt)
      lines.push(``)
      lines.push(`Musical Elements:`)
      lines.push(`- Clear melodic structure with memorable hooks`)
      lines.push(`- Well-balanced mix of instruments`)
      lines.push(`- Dynamic progression with builds and releases`)
      lines.push(`- Professional production quality`)
      lines.push(`- Emotionally resonant arrangement`)
      break
  }

  return lines.join("\n")
}

export function PromptOptimizerContent() {
  const [inputPrompt, setInputPrompt] = useState("")
  const [outputPrompt, setOutputPrompt] = useState("")
  const [selectedType, setSelectedType] = useState<PromptType>("text")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOptimize = () => {
    if (!inputPrompt.trim()) return

    setIsProcessing(true)
    
    // Simulate processing delay for retro feel
    setTimeout(() => {
      const optimized = optimizePrompt(inputPrompt, selectedType)
      setOutputPrompt(optimized)
      setIsProcessing(false)
    }, 800)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputPrompt)
  }

  const handleClear = () => {
    setInputPrompt("")
    setOutputPrompt("")
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Type Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-card-foreground text-lg font-bold">Select Generation Type:</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(promptTypeConfig) as PromptType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 border-2 border-border text-lg transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-card-foreground hover:bg-muted"
              }`}
            >
              {promptTypeConfig[type].icon} {promptTypeConfig[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-secondary border-2 border-border p-3">
        <p className="text-card-foreground text-sm font-bold mb-2">Tips for {promptTypeConfig[selectedType].label}:</p>
        <ul className="text-card-foreground text-sm list-disc list-inside">
          {promptTypeConfig[selectedType].tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-2">
        <label className="text-card-foreground text-lg font-bold">Your Prompt:</label>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-3 bg-input border-2 border-border text-lg text-card-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary font-mono"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleOptimize}
          disabled={!inputPrompt.trim() || isProcessing}
          className="px-4 py-2 bg-primary text-primary-foreground border-2 border-border text-lg font-bold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {isProcessing ? "Processing..." : "Optimize Prompt"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-secondary text-card-foreground border-2 border-border text-lg hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          Clear
        </button>
      </div>

      {/* Output Area */}
      {outputPrompt && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-card-foreground text-lg font-bold">Optimized Prompt:</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-secondary text-card-foreground border-2 border-border text-sm hover:bg-muted"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="w-full p-3 bg-input border-2 border-border text-lg text-card-foreground whitespace-pre-wrap font-mono overflow-auto max-h-64">
            {outputPrompt}
          </pre>
        </div>
      )}
    </div>
  )
}
