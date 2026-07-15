import { config } from 'dotenv'
config({ path: '.env.local' })
config() // falls back to .env if present (e.g. on Hostinger)

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'

// Route handlers (reuse the same logic from api/ folder)
import registerHandler from './api/auth/register.js'
import loginHandler from './api/auth/login.js'
import likedHandler from './api/movies/liked.js'
import likeHandler from './api/movies/like.js'
import commentsHandler from './api/movies/comments.js'
import recommendationsHandler from './api/ai/recommendations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

const app = express()
// Hostinger's Node.js app manager (Passenger/LiteSpeed) assigns the port via
// process.env.PORT — fall back to API_PORT/5001 for local dev.
const PORT = process.env.PORT ?? process.env.API_PORT ?? 5001

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:4000' }))
app.use(express.json())

// Wrap Vercel-style handlers (req, res) — Express uses the same signature
app.post('/api/auth/register', registerHandler)
app.post('/api/auth/login', loginHandler)
app.get('/api/movies/liked', likedHandler)
app.post('/api/movies/like', likeHandler)
app.delete('/api/movies/like', likeHandler)
app.get('/api/movies/comments', commentsHandler)
app.post('/api/movies/comments', commentsHandler)
app.delete('/api/movies/comments', commentsHandler)
app.get('/api/ai/recommendations', recommendationsHandler)

// Serve the built frontend (npm run build → dist/) so this single process
// can host both the API and the SPA, e.g. on shared hosting without a
// separate static-file layer in front of it.
app.use(express.static(distDir))
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`\n  ✦ StreamVault server running at http://localhost:${PORT}\n`)
})
