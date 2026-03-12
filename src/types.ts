export interface LanyardSpotify {
  track_id: string
  song: string
  artist: string
  album: string
  album_art_url: string
  timestamps: { start: number; end: number }
}

export interface LanyardActivity {
  name: string
  type: number
  state?: string
  details?: string
  application_id?: string
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
}

export interface LanyardData {
  spotify: LanyardSpotify | null
  listening_to_spotify: boolean
  discord_status: string
  activities: LanyardActivity[]
  discord_user: {
    id: string
    username: string
    display_name: string | null
    avatar: string | null
    global_name: string | null
  }
}
