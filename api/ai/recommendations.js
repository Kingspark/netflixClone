import pool from '../_lib/db.js'
import { verifyToken } from '../_lib/authMiddleware.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = verifyToken(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const [liked] = await pool.execute(
      `SELECT title, genres, media_type
       FROM movie_likes
       WHERE user_id = ?
       ORDER BY liked_at DESC
       LIMIT 10`,
      [user.userId]
    )

    if (liked.length === 0) {
      return res.json({ recommendations: [], reason: 'Like some movies first to get recommendations.' })
    }

    const likedSummary = liked
      .map((m) => {
        const genres = typeof m.genres === 'string' ? JSON.parse(m.genres) : (m.genres ?? [])
        const genreStr = Array.isArray(genres) ? genres.join(', ') : genres
        return `"${m.title}" (${m.media_type}${genreStr ? `, ${genreStr}` : ''})`
      })
      .join('; ')

    const prompt = `You are a movie and TV recommendation engine.
The user has liked: ${likedSummary}

Recommend exactly 8 titles they would enjoy next. Return ONLY valid JSON — no markdown, no explanation, no code fences.
Format: [{"title":"...","type":"movie or tv","reason":"one short sentence"}]`

    const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      }
    )

    const geminiData = await geminiRes.json()

    if (!geminiRes.ok) {
      console.error('Gemini API error:', geminiData.error ?? geminiData)
      return res.status(502).json({
        error: geminiData.error?.message ?? 'Gemini API request failed',
        recommendations: [],
      })
    }

    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const recommendations = JSON.parse(cleaned)

    res.json({ recommendations })
  } catch (error) {
    console.error('AI recommendations error:', error)
    res.status(500).json({ error: 'Recommendations unavailable', recommendations: [] })
  }
}
