type Category = 'logic' | 'cipher' | 'riddle' | 'mixed'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Puzzle {
  title: string
  question: string
  options: string[]
  correctAnswer: number
  hint: string
  explanation: string
}

interface ApiRequest {
  method?: string
  body?: unknown
}

interface ApiResponse {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(payload: Record<string, unknown>): void
}

const categories: Category[] = ['logic', 'cipher', 'riddle', 'mixed']
const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

const responseSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    question: { type: 'STRING' },
    options: { type: 'ARRAY', items: { type: 'STRING' } },
    correctAnswer: { type: 'INTEGER' },
    hint: { type: 'STRING' },
    explanation: { type: 'STRING' },
  },
  required: ['title', 'question', 'options', 'correctAnswer', 'hint', 'explanation'],
}

function send(res: ApiResponse, status: number, payload: Record<string, unknown>): void {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.status(status).json(payload)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null

  const cleaned = value
    .replace(/<[^>]*>/g, '')
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0)
      return !(code <= 0x08 || (code >= 0x0B && code <= 0x0C) || (code >= 0x0E && code <= 0x1F))
    })
    .join('')
    .trim()

  if (!cleaned || cleaned.length > maxLength) return null
  return cleaned
}

function validatePuzzle(value: unknown): Puzzle | null {
  if (!isRecord(value)) return null

  const title = cleanText(value.title, 100)
  const question = cleanText(value.question, 700)
  const hint = cleanText(value.hint, 300)
  const explanation = cleanText(value.explanation, 500)

  if (!title || !question || !hint || !explanation) return null
  if (!Array.isArray(value.options) || value.options.length !== 4) return null

  const options = value.options.map((item) => cleanText(item, 160))
  if (options.some((item) => item === null)) return null

  if (new Set((options as string[]).map((item) => item.toLowerCase())).size !== 4) {
    return null
  }

  if (
    !Number.isInteger(value.correctAnswer) ||
    (value.correctAnswer as number) < 0 ||
    (value.correctAnswer as number) > 3
  ) {
    return null
  }

  return {
    title,
    question,
    options: options as string[],
    correctAnswer: value.correctAnswer as number,
    hint,
    explanation,
  }
}

export default async function handler(
  req: ApiRequest,
  res: ApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed.' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    send(res, 500, { error: 'AI service is not configured.' })
    return
  }

  try {
    let body: unknown = req.body

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        send(res, 400, { error: 'Request body must contain valid JSON.' })
        return
      }
    }

    if (!isRecord(body)) {
      send(res, 400, { error: 'Invalid request body.' })
      return
    }

    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > 10_000) {
      send(res, 413, { error: 'Request body is too large.' })
      return
    }

    const category = body.category
    const difficulty = body.difficulty

    if (
      typeof category !== 'string' ||
      !categories.includes(category as Category) ||
      typeof difficulty !== 'string' ||
      !difficulties.includes(difficulty as Difficulty)
    ) {
      send(res, 400, { error: 'Choose a valid category and difficulty.' })
      return
    }

    const prompt = [
      'You are the puzzle generator for NEUROQUEST, a futuristic intelligence escape game.',
      `Create exactly one original ${category} puzzle at ${difficulty} difficulty.`,
      'Make it logically correct, self-contained, and solvable.',
      'Provide exactly four distinct answer options.',
      'The correctAnswer must be the zero-based index of exactly one correct option.',
      'Do not include the answer in the question or hint.',
      'Keep the explanation concise and educational.',
      'Return only the requested JSON structure.',
    ].join('\n')

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.8,
            maxOutputTokens: 1000,
          },
        }),
      },
    )

    if (!geminiResponse.ok) {
      const errorDetails = await geminiResponse.text()
      console.error('[generate-puzzle] Gemini HTTP status:', geminiResponse.status)
      console.error('[generate-puzzle] Gemini error details:', errorDetails.slice(0, 2000))
      send(res, 502, { error: 'Gemini service could not generate a puzzle. Try again.' })
      return
    }

    const geminiData: unknown = await geminiResponse.json()
    const candidates = isRecord(geminiData) ? geminiData.candidates : undefined
    const candidate = Array.isArray(candidates) ? candidates[0] : undefined

    if (
      !isRecord(candidate) ||
      !isRecord(candidate.content) ||
      !Array.isArray(candidate.content.parts)
    ) {
      send(res, 502, { error: 'The AI did not return a puzzle. Try again.' })
      return
    }

    const textPart = candidate.content.parts.find(
      (part: unknown) => isRecord(part) && typeof part.text === 'string',
    )

    if (!isRecord(textPart) || typeof textPart.text !== 'string') {
      send(res, 502, { error: 'The AI did not return a puzzle. Try again.' })
      return
    }

    const generated: unknown = JSON.parse(textPart.text)
    const puzzle = validatePuzzle(generated)

    if (!puzzle) {
      send(res, 502, { error: 'The generated puzzle was invalid. Try again.' })
      return
    }

    send(res, 200, { puzzle })
  } catch (error) {
    console.error(
      '[generate-puzzle] Diagnostic:',
      error instanceof Error
        ? { name: error.name, message: error.message }
        : String(error),
    )

    send(res, 500, { error: 'Puzzle generation failed. Please try again.' })
  }
}
