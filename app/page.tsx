"use client"

import { PromptOptimizerContent } from "@/components/prompt-optimizer"

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Classic Mac-style title bar */}
      <header className="flex-shrink-0 bg-card border-b-2 border-border px-4 py-2 flex items-center">
        <h1 className="text-xl font-bold text-card-foreground">GioPrompt v1.0 - Prompt Optimizer</h1>
      </header>
      <main className="flex-1 min-h-0 overflow-auto px-6 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <PromptOptimizerContent />
        </div>
      </main>
      <footer className="flex-shrink-0 bg-card border-t-2 border-border px-4 py-1.5 flex items-center justify-between">
        <span className="text-card-foreground text-sm">Ready</span>
        <span className="text-card-foreground text-sm">GioPrompt System v1.0</span>
      </footer>
    </div>
  )
}
