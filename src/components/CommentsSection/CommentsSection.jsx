import { useEffect, useState } from 'react'
import { commentsApi } from '../../services/apiService'
import styles from './CommentsSection.module.css'

function formatTimestamp(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function CommentsSection({ movieId, title, mediaType, authToken = null, currentUser = null }) {
  const [comments, setComments] = useState([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!movieId) return
    let isMounted = true
    setIsLoading(true)

    commentsApi.getComments(movieId)
      .then(({ comments: fetched }) => { if (isMounted) setComments(fetched ?? []) })
      .catch(() => { if (isMounted) setError('Could not load comments.') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [movieId])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed || !authToken) return

    setIsSubmitting(true)
    setError('')

    try {
      const { comment } = await commentsApi.addComment({ movieId, title, mediaType, body: trimmed })
      setComments((prev) => [{ ...comment, email: currentUser }, ...prev])
      setDraft('')
    } catch {
      setError('Could not post your comment. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(commentId) {
    const previous = comments
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    try {
      await commentsApi.deleteComment(commentId)
    } catch {
      setComments(previous)
      setError('Could not delete comment.')
    }
  }

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.heading}>Comments {comments.length > 0 ? `(${comments.length})` : ''}</h3>

      {authToken ? (
        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share your thoughts..."
            maxLength={1000}
            rows={2}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting || !draft.trim()}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <p className={styles.signInPrompt}>Sign in to leave a comment.</p>
      )}

      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <p className={styles.emptyState}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className={styles.emptyState}>No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>{comment.email}</span>
                <span className={styles.commentDate}>{formatTimestamp(comment.created_at)}</span>
              </div>
              <p className={styles.commentBody}>{comment.body}</p>
              {currentUser && comment.email === currentUser ? (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
