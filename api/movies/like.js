import pool from '../_lib/db.js'
import { verifyToken } from '../_lib/authMiddleware.js'

export default async function handler(req, res) {
  const user = verifyToken(req)
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { movieId, title, genres, posterPath, mediaType } = req.body ?? {}

  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' })
  }

  try {
    if (req.method === 'POST') {
      await pool.execute(
        `INSERT INTO movie_likes (user_id, movie_id, title, genres, poster_path, media_type)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE liked_at = NOW()`,
        [
          user.userId,
          String(movieId),
          title ?? '',
          JSON.stringify(genres ?? []),
          posterPath ?? '',
          mediaType ?? 'movie',
        ]
      )
      return res.json({ liked: true })
    }

    if (req.method === 'DELETE') {
      await pool.execute(
        'DELETE FROM movie_likes WHERE user_id = ? AND movie_id = ?',
        [user.userId, String(movieId)]
      )
      return res.json({ liked: false })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Like/unlike error:', error)
    res.status(500).json({ error: 'Failed to update like' })
  }
}
