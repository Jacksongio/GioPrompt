"use client"

import { useState } from "react"

type PromptType = "text" | "image" | "video" | "code" | "music"

interface OptimizeResponse {
  optimizedPrompt: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const promptTypeConfig: Record<PromptType, { label: string; icon: string; tips: string[]; advancedFields: { label: string; placeholder: string }[] }> = {
  text: {
    label: "Text Generation",
    icon: "📝",
    tips: [
      "Be specific about tone and style",
      "Include context and background",
      "Specify desired length and format",
      "Add examples when possible",
    ],
    advancedFields: [
      { label: "Target Audience", placeholder: "e.g., Technical experts, General public, Students..." },
      { label: "Tone & Voice", placeholder: "e.g., Professional, Casual, Humorous, Academic..." },
      { label: "Length & Format", placeholder: "e.g., 500 words, 3 paragraphs, Bullet points..." },
      { label: "Key Points to Include", placeholder: "e.g., Statistics, Examples, Quotes..." },
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
    advancedFields: [
      { label: "Art Style", placeholder: "e.g., Photorealistic, Oil painting, Anime, 3D render..." },
      { label: "Lighting", placeholder: "e.g., Golden hour, Studio lighting, Dramatic shadows..." },
      { label: "Camera Angle", placeholder: "e.g., Eye-level, Bird's eye view, Low angle..." },
      { label: "Color Palette", placeholder: "e.g., Warm tones, Vibrant, Monochrome, Pastel..." },
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
    advancedFields: [
      { label: "Duration & Pacing", placeholder: "e.g., 30 seconds, Fast-paced, Slow and cinematic..." },
      { label: "Camera Movement", placeholder: "e.g., Static, Slow pan, Dolly zoom, Handheld..." },
      { label: "Transitions", placeholder: "e.g., Hard cuts, Fade to black, Crossfade..." },
      { label: "Audio/Music", placeholder: "e.g., Upbeat music, Ambient sounds, Voice-over..." },
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
    advancedFields: [
      { label: "Language & Version", placeholder: "e.g., Python 3.11, TypeScript 5.0, Java 17..." },
      { label: "Framework/Libraries", placeholder: "e.g., React, Flask, Spring Boot, No dependencies..." },
      { label: "Error Handling", placeholder: "e.g., Try/catch blocks, Return error codes, Throw exceptions..." },
      { label: "Performance Requirements", placeholder: "e.g., O(n) complexity, Async/await, Caching..." },
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
    advancedFields: [
      { label: "Genre & Style", placeholder: "e.g., Jazz fusion, EDM, Classical, Lo-fi hip-hop..." },
      { label: "Tempo & Key", placeholder: "e.g., 120 BPM, C Major, Slow tempo in D minor..." },
      { label: "Instruments", placeholder: "e.g., Piano, Synthesizer, Orchestra, Acoustic guitar..." },
      { label: "Reference Artists", placeholder: "e.g., Similar to Daft Punk, Miles Davis style..." },
    ],
  },
}

async function optimizePrompt(prompt: string, type: PromptType, advancedFields?: Record<string, string>): Promise<string> {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, type, advancedFields }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to optimize prompt')
  }

  const data: OptimizeResponse = await response.json()
  return data.optimizedPrompt
}

export function PromptOptimizerContent() {
  const [inputPrompt, setInputPrompt] = useState("")
  const [outputPrompt, setOutputPrompt] = useState("")
  const [selectedType, setSelectedType] = useState<PromptType>("text")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)
  const [advancedFields, setAdvancedFields] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  })

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) return

    setIsProcessing(true)
    setError(null)
    
    try {
      // Build advanced fields context
      const config = promptTypeConfig[selectedType]
      const advancedContext: Record<string, string> = {}
      
      Object.entries(advancedFields).forEach(([key, value], index) => {
        if (value.trim()) {
          advancedContext[config.advancedFields[index].label] = value
        }
      })

      const optimized = await optimizePrompt(inputPrompt, selectedType, advancedContext)
      setOutputPrompt(optimized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while optimizing')
      console.error('Optimization error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputPrompt)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleClear = () => {
    setInputPrompt("")
    setOutputPrompt("")
    setError(null)
  }

  const handleAdvancedFieldChange = (fieldKey: keyof typeof advancedFields, value: string) => {
    setAdvancedFields(prev => ({
      ...prev,
      [fieldKey]: value,
    }))
  }

  const resetAdvancedFields = () => {
    setAdvancedFields({
      field1: "",
      field2: "",
      field3: "",
      field4: "",
    })
  }

  return (
    <div className="flex flex-col gap-4 min-h-full">
      {/* Type Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-lg font-bold">Select Generation Type:</label>
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
        <label className="text-white text-lg font-bold">Your Prompt:</label>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 min-h-[8rem] max-h-[32rem] p-3 bg-input border-2 border-border text-lg text-card-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:border-primary font-mono"
        />
      </div>

      {/* Advanced Fields */}
      {showAdvanced && (
        <div className="bg-secondary border-2 border-border p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-card-foreground text-sm font-bold">Advanced Options (Optional):</p>
            <button
              onClick={resetAdvancedFields}
              className="px-2 py-1 text-xs text-card-foreground hover:text-white underline"
            >
              Reset All
            </button>
          </div>
          {promptTypeConfig[selectedType].advancedFields.map((field, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-card-foreground text-sm">{field.label}:</label>
              <input
                type="text"
                value={advancedFields[`field${i + 1}` as keyof typeof advancedFields]}
                onChange={(e) => handleAdvancedFieldChange(`field${i + 1}` as keyof typeof advancedFields, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-2 bg-input border-2 border-border text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleOptimize}
          disabled={!inputPrompt.trim() || isProcessing}
          className="px-4 py-2 bg-primary text-primary-foreground border-2 border-border text-lg font-bold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {isProcessing ? "Optimizing..." : outputPrompt ? "Regenerate Prompt" : "Optimize Prompt"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-secondary text-card-foreground border-2 border-border text-lg hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          Clear
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 border-2 border-border text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
            showAdvanced
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-card-foreground hover:bg-muted"
          }`}
        >
          Advanced {showAdvanced ? "▲" : "▼"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 p-3 text-red-500">
          <p className="font-bold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Output Area */}
      {outputPrompt && (
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <label className="text-white text-lg font-bold">Optimized Prompt:</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-secondary text-card-foreground border-2 border-border text-sm hover:bg-muted"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
          <textarea
            value={outputPrompt}
            onChange={(e) => setOutputPrompt(e.target.value)}
            placeholder="Your optimized prompt will appear here..."
            className="w-full min-h-[16rem] max-h-[48rem] p-3 bg-input border-2 border-border text-lg text-black placeholder:text-muted-foreground whitespace-pre-wrap font-mono overflow-auto resize-y focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Bottom spacer so you can scroll past the Optimized Prompt box */}
      <div className="min-h-[1.5rem] flex-shrink-0" aria-hidden="true" />
    </div>
  )
}
