import pool from '../_lib/db.js'
import { verifyToken } from '../_lib/authMiddleware.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { movieId } = req.query ?? {}
      if (!movieId) {
        return res.status(400).json({ error: 'movieId is required' })
      }

      const [rows] = await pool.execute(
        `SELECT c.id, c.user_id, c.body, c.created_at, u.email
         FROM movie_comments c
         JOIN users u ON u.id = c.user_id
         WHERE c.movie_id = ?
         ORDER BY c.created_at DESC`,
        [String(movieId)]
      )

      return res.json({ comments: rows })
    }

    const user = verifyToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'POST') {
      const { movieId, title, mediaType, body } = req.body ?? {}
      const trimmedBody = (body ?? '').trim()

      if (!movieId || !trimmedBody) {
        return res.status(400).json({ error: 'movieId and body are required' })
      }
      if (trimmedBody.length > 1000) {
        return res.status(400).json({ error: 'Comment is too long (max 1000 characters)' })
      }

      const [result] = await pool.execute(
        `INSERT INTO movie_comments (user_id, movie_id, title, media_type, body)
         VALUES (?, ?, ?, ?, ?)`,
        [user.userId, String(movieId), title ?? '', mediaType ?? 'movie', trimmedBody]
      )

      return res.json({
        comment: {
          id: result.insertId,
          user_id: user.userId,
          email: user.email,
          body: trimmedBody,
          created_at: new Date().toISOString(),
        },
      })
    }

    if (req.method === 'DELETE') {
      const { commentId } = req.body ?? {}
      if (!commentId) {
        return res.status(400).json({ error: 'commentId is required' })
      }

      const [result] = await pool.execute(
        'DELETE FROM movie_comments WHERE id = ? AND user_id = ?',
        [commentId, user.userId]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Comment not found' })
      }

      return res.json({ deleted: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Comments error:', error)
    res.status(500).json({ error: 'Comment request failed' })
  }
}
