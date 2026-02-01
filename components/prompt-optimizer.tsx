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

async function optimizePrompt(prompt: string, type: PromptType, params?: Record<string, string>): Promise<string> {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, type, advancedParams: params }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to optimize prompt')
  }

  const data: OptimizeResponse = await response.json()
  return data.optimizedPrompt
}

interface AdvancedParams {
  text: { length?: string; tone?: string; format?: string }
  image: { style?: string; quality?: string; aspectRatio?: string }
  video: { duration?: string; fps?: string; resolution?: string }
  code: { language?: string; framework?: string; complexity?: string }
  music: { bpm?: string; duration?: string; genre?: string; key?: string }
}

export function PromptOptimizerContent() {
  const [inputPrompt, setInputPrompt] = useState("")
  const [outputPrompt, setOutputPrompt] = useState("")
  const [selectedType, setSelectedType] = useState<PromptType>("text")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedParams, setAdvancedParams] = useState<AdvancedParams>({
    text: {},
    image: {},
    video: {},
    code: {},
    music: {}
  })

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) return

    setIsProcessing(true)
    setError(null)
    
    try {
      const params = advancedParams[selectedType]
      const optimized = await optimizePrompt(inputPrompt, selectedType, params)
      setOutputPrompt(optimized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while optimizing')
      console.error('Optimization error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateAdvancedParam = (key: string, value: string) => {
    setAdvancedParams(prev => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        [key]: value
      }
    }))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputPrompt)
  }

  const handleClear = () => {
    setInputPrompt("")
    setOutputPrompt("")
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Type Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-card-foreground text-lg font-bold text-center sm:text-left">Select Generation Type:</label>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
          className="w-full h-32 min-h-[8rem] max-h-[32rem] p-3 bg-input border-2 border-border text-lg text-card-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:border-primary font-mono"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleOptimize}
          disabled={!inputPrompt.trim() || isProcessing}
          className="px-4 py-2 bg-primary text-primary-foreground border-2 border-border text-lg font-bold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {isProcessing ? "Optimizing..." : "Optimize Prompt"}
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-accent text-white border-2 border-border text-lg hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {showAdvanced ? "Hide Advanced" : "Advanced"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-secondary text-card-foreground border-2 border-border text-lg hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          Clear
        </button>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-secondary border-2 border-border p-4">
          <h3 className="text-card-foreground text-lg font-bold mb-3">Advanced Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            {selectedType === "text" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Length:</label>
                  <input
                    type="text"
                    placeholder="e.g., 500 words"
                    value={advancedParams.text.length || ""}
                    onChange={(e) => updateAdvancedParam("length", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Tone:</label>
                  <input
                    type="text"
                    placeholder="e.g., professional, casual"
                    value={advancedParams.text.tone || ""}
                    onChange={(e) => updateAdvancedParam("tone", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Format:</label>
                  <input
                    type="text"
                    placeholder="e.g., article, email, essay"
                    value={advancedParams.text.format || ""}
                    onChange={(e) => updateAdvancedParam("format", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {selectedType === "image" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Style:</label>
                  <input
                    type="text"
                    placeholder="e.g., photorealistic, anime"
                    value={advancedParams.image.style || ""}
                    onChange={(e) => updateAdvancedParam("style", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Quality:</label>
                  <input
                    type="text"
                    placeholder="e.g., 4K, 8K, HD"
                    value={advancedParams.image.quality || ""}
                    onChange={(e) => updateAdvancedParam("quality", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Aspect Ratio:</label>
                  <input
                    type="text"
                    placeholder="e.g., 16:9, 1:1, 9:16"
                    value={advancedParams.image.aspectRatio || ""}
                    onChange={(e) => updateAdvancedParam("aspectRatio", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {selectedType === "video" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g., 30 seconds, 2 minutes"
                    value={advancedParams.video.duration || ""}
                    onChange={(e) => updateAdvancedParam("duration", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Frame Rate:</label>
                  <input
                    type="text"
                    placeholder="e.g., 24fps, 30fps, 60fps"
                    value={advancedParams.video.fps || ""}
                    onChange={(e) => updateAdvancedParam("fps", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Resolution:</label>
                  <input
                    type="text"
                    placeholder="e.g., 4K, HD, 1080p"
                    value={advancedParams.video.resolution || ""}
                    onChange={(e) => updateAdvancedParam("resolution", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {selectedType === "code" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Language:</label>
                  <input
                    type="text"
                    placeholder="e.g., Python, JavaScript, TypeScript"
                    value={advancedParams.code.language || ""}
                    onChange={(e) => updateAdvancedParam("language", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Framework:</label>
                  <input
                    type="text"
                    placeholder="e.g., React, Django, Express"
                    value={advancedParams.code.framework || ""}
                    onChange={(e) => updateAdvancedParam("framework", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Complexity:</label>
                  <input
                    type="text"
                    placeholder="e.g., simple, intermediate, advanced"
                    value={advancedParams.code.complexity || ""}
                    onChange={(e) => updateAdvancedParam("complexity", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {selectedType === "music" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">BPM:</label>
                  <input
                    type="text"
                    placeholder="e.g., 120, 90-140"
                    value={advancedParams.music.bpm || ""}
                    onChange={(e) => updateAdvancedParam("bpm", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g., 3 minutes, 2:30"
                    value={advancedParams.music.duration || ""}
                    onChange={(e) => updateAdvancedParam("duration", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Genre:</label>
                  <input
                    type="text"
                    placeholder="e.g., Pop, Rock, Electronic"
                    value={advancedParams.music.genre || ""}
                    onChange={(e) => updateAdvancedParam("genre", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-card-foreground text-sm font-bold">Key:</label>
                  <input
                    type="text"
                    placeholder="e.g., C Major, A Minor"
                    value={advancedParams.music.key || ""}
                    onChange={(e) => updateAdvancedParam("key", e.target.value)}
                    className="p-2 bg-input border-2 border-border text-card-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500 p-3 text-red-500">
          <p className="font-bold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

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
          <textarea
            value={outputPrompt}
            onChange={(e) => setOutputPrompt(e.target.value)}
            placeholder="Your optimized prompt will appear here..."
            className="w-full min-h-[16rem] max-h-[48rem] p-3 bg-input border-2 border-border text-lg text-card-foreground placeholder:text-muted-foreground whitespace-pre-wrap font-mono overflow-auto resize-y focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  )
}
