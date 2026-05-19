import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { commentsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface Comment {
  id: number
  content: string
  userId: number
  nickname: string
  createdAt: string
}

const PAGE_SIZE = 20

function formatTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

export function CommentSection() {
  const { user, openAuthDialog } = useAuth()

  const [allComments, setAllComments] = useState<Comment[]>([])
  const [displayPage, setDisplayPage] = useState(1)
  const [fetchPage, setFetchPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const hasMore = displayPage < totalPages

  const fetchComments = useCallback(async (pageToFetch: number) => {
    setLoading(true)
    setError('')
    try {
      const result = await commentsApi.list({ page: pageToFetch, pageSize: PAGE_SIZE })
      setAllComments(prev => {
        const existing = new Map(prev.map(c => [c.id, c]))
        result.comments.forEach(c => {
          existing.set(c.id, {
            id: c.id,
            content: c.content,
            userId: c.user_id,
            nickname: c.nickname,
            createdAt: c.created_at,
          })
        })
        return Array.from(existing.values())
      })
      setTotalPages(result.totalPages)
    } catch {
      setError('加载评论失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComments(1)
  }, [fetchComments])

  async function handleSubmit() {
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await commentsApi.create({ content: content.trim() })
      setContent('')
      setFetchPage(1)
      await fetchComments(1)
      setDisplayPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : '发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    setError('')
    try {
      await commentsApi.remove(id)
      setAllComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除评论失败')
    }
  }

  function handleLoadMore() {
    if (displayPage < totalPages) {
      const nextPage = displayPage + 1
      setDisplayPage(nextPage)
      if (nextPage > fetchPage) {
        setFetchPage(nextPage)
        fetchComments(nextPage)
      }
    }
  }

  function handleInputFocus() {
    if (!user) {
      openAuthDialog('login')
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="mb-4 font-display text-2xl text-text">
        评论区
        {allComments.length > 0 && (
          <span className="ml-2 font-body text-base text-muted">
            ({allComments.length})
          </span>
        )}
      </h2>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Textarea
            placeholder={user ? '写下你的评论...' : '登录后即可发表评论'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleInputFocus}
            disabled={submitting}
            className="mb-3"
            rows={3}
          />
          <div className="flex items-center justify-between">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={submitting || !content.trim() || !user}
            >
              {submitting ? '发表中...' : '发表评论'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <p className="text-center text-muted">加载中...</p>
      )}

      {!loading && allComments.length === 0 && (
        <p className="text-center text-muted">暂无评论，来发表第一条评论吧</p>
      )}

      {!loading && allComments.length > 0 && (
        <div className="flex flex-col gap-3">
          {allComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-text">
                    {comment.nickname}
                  </span>
                  <span className="text-xs text-muted">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-text2">
                  {comment.content}
                </p>
                {user && user.id === comment.userId && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleLoadMore}>
                加载更多
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}