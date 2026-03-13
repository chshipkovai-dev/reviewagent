import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const { client_name, amount, days_overdue, description } = await req.json()

    const prompt = `You are helping a freelancer follow up on an overdue invoice.

Invoice details:
- Client: ${client_name}
- Amount: $${amount}
- Days overdue: ${days_overdue}
- Project: ${description || 'freelance project'}

Write exactly 3 follow-up email versions. Each must be complete and ready to send.

Version 1 — Friendly: warm, assume it slipped through, no pressure
Version 2 — Firm: professional, direct, clear urgency
Version 3 — Final Notice: serious tone, mention next steps if unpaid

Respond with ONLY valid JSON, no markdown:
{"versions":["email1 full text","email2 full text","email3 full text"]}`

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (msg.content[0] as { type: string; text: string }).text
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const { versions } = JSON.parse(cleaned)

    return NextResponse.json({ versions })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('generate error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
