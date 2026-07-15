import jwt from 'jsonwebtoken'

export function verifyToken(req) {
  const authHeader = req.headers['authorization'] ?? req.headers['Authorization']
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}
