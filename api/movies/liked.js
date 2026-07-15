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
    const [rows] = await pool.execute(
      `SELECT movie_id, title, genres, poster_path, media_type
       FROM movie_likes
       WHERE user_id = ?
       ORDER BY liked_at DESC`,
      [user.userId]
    )

    res.json({
      liked: rows.map((r) => ({
        ...r,
        genres: typeof r.genres === 'string' ? JSON.parse(r.genres) : r.genres,
      })),
    })
  } catch (error) {
    console.error('Get liked error:', error)
    res.status(500).json({ error: 'Failed to fetch liked movies' })
  }
}
