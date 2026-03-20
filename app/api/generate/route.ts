import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MAX_REVIEWS = 10
const MAX_REVIEW_LENGTH = 2000
const MAX_FIELD_LENGTH = 100

export async function POST(req: Request) {
  try {
    // 1. Auth check — reject unauthenticated requests
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Request size limit — reject oversized payloads
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50_000) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    const { business_name, business_type, tone, reviews } = await req.json()

    // 3. Input validation
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews provided' }, { status: 400 })
    }
    if (reviews.length > MAX_REVIEWS) {
      return NextResponse.json({ error: `Maximum ${MAX_REVIEWS} reviews allowed` }, { status: 400 })
    }
    if (business_name && String(business_name).length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: 'Business name too long' }, { status: 400 })
    }

    // Sanitize inputs — strip to plain text
    const safeName = String(business_name || 'this business').slice(0, MAX_FIELD_LENGTH)
    const safeType = String(business_type || 'business').slice(0, MAX_FIELD_LENGTH)
    const safeTone = ['friendly', 'professional', 'formal'].includes(tone) ? tone : 'professional'
    const safeReviews = reviews
      .map((r: unknown) => String(r).slice(0, MAX_REVIEW_LENGTH))
      .filter(r => r.trim().length > 0)

    if (safeReviews.length === 0) {
      return NextResponse.json({ error: 'No valid reviews provided' }, { status: 400 })
    }

    const toneDesc =
      safeTone === 'friendly' ? 'warm, personal, and appreciative' :
      safeTone === 'professional' ? 'professional, polished, and courteous' :
      'formal, concise, and respectful'

    const reviewList = safeReviews
      .map((r: string, i: number) => `Review ${i + 1}: ${r}`)
      .join('\n\n')

    const prompt = `You are helping ${safeName} (a ${safeType}) respond to Google reviews.

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
    const parsed = JSON.parse(cleaned)

    if (!parsed.responses || !Array.isArray(parsed.responses)) {
      return NextResponse.json({ error: 'Unexpected AI response format' }, { status: 500 })
    }

    return NextResponse.json({ responses: parsed.responses })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('generate error:', msg)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
