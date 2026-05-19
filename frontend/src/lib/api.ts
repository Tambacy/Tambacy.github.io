const BASE_URL = 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const json: ApiResponse<T> = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error || `请求失败 (${response.status})`)
  }

  return json.data as T
}

export const authApi = {
  register: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: number; email: string; nickname: string } }>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: number; email: string; nickname: string } }>('/auth/login', {
      method: 'POST',
      body: data,
    }),

  getMe: () =>
    request<{ id: number; email: string; nickname: string }>('/auth/me'),
}

export const commentsApi = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.pageSize) query.set('pageSize', String(params.pageSize))
    const qs = query.toString()
    return request<{
      comments: Array<{ id: number; content: string; created_at: string; nickname: string; user_id: number }>
      total: number
      page: number
      totalPages: number
    }>(`/comments${qs ? '?' + qs : ''}`)
  },

  create: (data: { content: string }) =>
    request<{ id: number; content: string; userId: number }>('/comments', {
      method: 'POST',
      body: data,
    }),

  remove: (id: number) =>
    request<null>(`/comments/${id}`, {
      method: 'DELETE',
    }),
}

export const diagnosticApi = {
  save: (data: { typeCode: string; typeName: string; scores: number[] }) =>
    request<{ id: number; typeCode: string; typeName: string; scores: number[] }>('/diagnostic', {
      method: 'POST',
      body: data,
    }),

  getHistory: () =>
    request<Array<{ id: number; typeCode: string; typeName: string; scores: number[]; createdAt: string }>>('/diagnostic/history'),
}