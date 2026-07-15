// Central API client — all fetch calls go through here

function getToken() {
  return localStorage.getItem('sv_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Network error — check your connection.')
  }

  // Guard against non-JSON responses (e.g. an HTML error page instead of the API)
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    if (res.status === 404) throw new Error('API route not found. Check that the backend server is running and reachable.')
    throw new Error(`Unexpected server response (${res.status})`)
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data
}

// ---------- Auth ----------
export const authApi = {
  register: (email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}

// ---------- Movies ----------
export const moviesApi = {
  getLiked: () => request('/api/movies/liked'),
  like: ({ movieId, title, genres, posterPath, mediaType }) =>
    request('/api/movies/like', {
      method: 'POST',
      body: JSON.stringify({ movieId, title, genres, posterPath, mediaType }),
    }),
  unlike: (movieId) =>
    request('/api/movies/like', {
      method: 'DELETE',
      body: JSON.stringify({ movieId }),
    }),
}

// ---------- Comments ----------
export const commentsApi = {
  getComments: (movieId) => request(`/api/movies/comments?movieId=${encodeURIComponent(movieId)}`),
  addComment: ({ movieId, title, mediaType, body }) =>
    request('/api/movies/comments', {
      method: 'POST',
      body: JSON.stringify({ movieId, title, mediaType, body }),
    }),
  deleteComment: (commentId) =>
    request('/api/movies/comments', {
      method: 'DELETE',
      body: JSON.stringify({ commentId }),
    }),
}

// ---------- AI ----------
export const aiApi = {
  getRecommendations: () => request('/api/ai/recommendations'),
}

// ---------- Token helpers ----------
export function saveToken(token) {
  localStorage.setItem('sv_token', token)
}

export function clearToken() {
  localStorage.removeItem('sv_token')
  localStorage.removeItem('sv_email')
}

export function getStoredToken() {
  return localStorage.getItem('sv_token')
}

export function getStoredEmail() {
  return localStorage.getItem('sv_email')
}

export function saveEmail(email) {
  localStorage.setItem('sv_email', email)
}
