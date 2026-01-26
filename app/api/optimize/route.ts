import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { readFile } from 'fs/promises'
import { join } from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type PromptType = 'text' | 'image' | 'video' | 'code' | 'music'

async function loadMetaPrompt(type: PromptType): Promise<string> {
  const filePath = join(process.cwd(), 'prompts', `${type}.txt`)
  const content = await readFile(filePath, 'utf-8')
  return content
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, advancedParams } = await request.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Load the appropriate meta-prompt
    const metaPrompt = await loadMetaPrompt(type as PromptType)

    // Build user message with advanced parameters
    let userMessage = `Please optimize this ${type} generation prompt:\n\n${prompt}`
    
    if (advancedParams && Object.keys(advancedParams).length > 0) {
      userMessage += '\n\nAdditional requirements:'
      Object.entries(advancedParams).forEach(([key, value]) => {
        if (value && value !== '') {
          userMessage += `\n- ${key}: ${value}`
        }
      })
    }

    // Call OpenAI API to optimize the prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: metaPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const optimizedPrompt = completion.choices[0]?.message?.content

    if (!optimizedPrompt) {
      return NextResponse.json(
        { error: 'Failed to generate optimized prompt' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      optimizedPrompt,
      usage: completion.usage,
    })
  } catch (error) {
    console.error('Error optimizing prompt:', error)
    return NextResponse.json(
      { error: 'Failed to optimize prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

