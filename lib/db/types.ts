export interface User {
  id: string
  name: string | null
  email: string
  email_verified: Date | null
  image: string | null
  password_hash: string | null
  created_at: Date
  updated_at: Date
}

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  is_owner: boolean
  created_at: Date
  updated_at: Date
}

export interface Letter {
  id: string
  content: string
  sender_id: string | null
  sender_display_name: string | null
  recipient_id: string
  is_anonymous: boolean
  is_read: boolean
  is_favorited: boolean
  created_at: Date
  read_at: Date | null
}

export interface ProfileWithEmail extends Profile {
  email: string
}
