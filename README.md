# use-lanyard
# this was made by ai for my website lmao

A lightweight React hook for accessing real-time Discord user data via the [Lanyard API](https://lanyard.rest/).

## Features

- 🔌 Real-time WebSocket connection to Lanyard API
- 🎵 Get Spotify listening status and track details
- 📊 Access Discord user info, status, and activities
- 🔄 Automatic reconnection with exponential backoff
- ⚡ TypeScript support with full type safety
- 🎯 Zero external dependencies (besides React)

## Installation

```bash
npm install use-lanyard
# or
yarn add use-lanyard
# or
pnpm add use-lanyard
```

## Usage

```tsx
import { useLanyard } from 'use-lanyard'

function MyComponent() {
  const lanyard = useLanyard('YOUR_DISCORD_USER_ID')

  return (
    <div>
      {lanyard?.listening_to_spotify ? (
        <div>
          <p>Now playing: {lanyard.spotify.song}</p>
          <p>Artist: {lanyard.spotify.artist}</p>
          <img src={lanyard.spotify.album_art_url} alt="Album art" />
        </div>
      ) : (
        <p>Not listening to Spotify</p>
      )}

      <p>Discord Status: {lanyard?.discord_status}</p>
    </div>
  )
}
```

## API

### `useLanyard(discordUserId: string)`

Returns `LanyardData | null` while connecting.

#### LanyardData

```typescript
interface LanyardData {
  spotify: LanyardSpotify | null
  listening_to_spotify: boolean
  discord_status: string // 'online', 'idle', 'dnd', 'offline'
  activities: LanyardActivity[]
  discord_user: {
    id: string
    username: string
    display_name: string | null
    avatar: string | null
    global_name: string | null
  }
}
```

#### LanyardSpotify

```typescript
interface LanyardSpotify {
  track_id: string
  song: string
  artist: string
  album: string
  album_art_url: string
  timestamps: { start: number; end: number }
}
```

#### LanyardActivity

```typescript
interface LanyardActivity {
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
```

## Examples

### Display Current Song

```tsx
function NowPlayingWidget() {
  const lanyard = useLanyard('YOUR_DISCORD_USER_ID')
  const track = lanyard?.spotify

  if (!lanyard?.listening_to_spotify) return <p>Not playing</p>

  return (
    <div className="now-playing">
      <img src={track?.album_art_url} alt="Album" />
      <div>
        <h3>{track?.song}</h3>
        <p>{track?.artist}</p>
      </div>
    </div>
  )
}
```

### Show Discord Status

```tsx
function DiscordStatus() {
  const lanyard = useLanyard('YOUR_DISCORD_USER_ID')

  return (
    <div>
      <span className={`status ${lanyard?.discord_status || 'offline'}`}>
        {lanyard?.discord_status || 'offline'}
      </span>
      <p>{lanyard?.discord_user.global_name || lanyard?.discord_user.username}</p>
    </div>
  )
}
```

## Browser Support

Works in all modern browsers that support WebSockets and ES2020.

## License

MIT

## Credits

- [Lanyard API](https://lanyard.rest/) by [Phin](https://github.com/eomm/lanyard)
