// User type
export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
}

// Bookmark type
export type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

// Session type
export type Session = {
  access_token: string
  refresh_token: string
  user: User
}

// Error type
export type AppError = {
  message: string
  code?: string
  details?: any
}

// Form types
export type BookmarkFormData = {
  title: string
  url: string
}