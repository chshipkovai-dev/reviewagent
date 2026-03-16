import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const { business_name, business_type, tone, reviews } = await req.json()

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews provided' }, { status: 400 })
    }

    const toneDesc =
      tone === 'friendly' ? 'warm, personal, and appreciative' :
      tone === 'professional' ? 'professional, polished, and courteous' :
      'formal, concise, and respectful'

    const reviewList = reviews
      .map((r: string, i: number) => `Review ${i + 1}: ${r}`)
      .join('\n\n')

    const prompt = `You are helping ${business_name} (a ${business_type}) respond to Google reviews.

Tone: ${toneDesc}

Write a response for EACH review below. Responses should:
- Be 2-4 sentences
- Sound human, not robotic
- For positive reviews: thank the customer sincerely and invite them back
- For negative reviews: apologize, acknowledge the issue, offer to resolve it
- Never be generic — reference specific details from the review when possible

${reviewList}

Respond with ONLY valid JSON, no markdown:
{"responses":["response1","response2","response3"]}`

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (msg.content[0] as { type: string; text: string }).text
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const { responses } = JSON.parse(cleaned)

    return NextResponse.json({ responses })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('generate error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
