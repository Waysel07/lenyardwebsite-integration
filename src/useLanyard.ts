import { useEffect, useState } from 'react'
import type { LanyardData } from './types'

export function useLanyard(discordUserId: string) {
  const [data, setData] = useState<LanyardData | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
    let disposed = false

    function cleanup() {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
        heartbeatInterval = null
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
        reconnectTimeout = null
      }
    }

    function connect() {
      if (disposed) return

      cleanup()
      ws = new WebSocket('wss://api.lanyard.rest/socket')

      ws.onopen = () => {
        if (disposed) { ws?.close(); return }
        ws?.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: discordUserId },
        }))
      }

      ws.onmessage = (event) => {
        if (disposed) return
        const msg = JSON.parse(event.data)

        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval
          heartbeatInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }))
            }
          }, interval)
        }

        if (msg.op === 0) {
          const d = msg.d
          setData({
            spotify: d.spotify ?? null,
            listening_to_spotify: d.listening_to_spotify ?? false,
            discord_status: d.discord_status ?? 'offline',
            activities: d.activities ?? [],
            discord_user: d.discord_user ?? { id: discordUserId, username: '', display_name: null, avatar: null, global_name: null },
          })
        }
      }

      ws.onclose = () => {
        cleanup()
        if (!disposed) {
          reconnectTimeout = setTimeout(connect, 5000)
        }
      }

      ws.onerror = () => {
        if (!disposed) ws?.close()
      }
    }

    // Delay connection slightly so React StrictMode's immediate
    // unmount-remount cycle doesn't trigger a "closed before established" warning
    const startTimeout = setTimeout(connect, 100)

    return () => {
      disposed = true
      clearTimeout(startTimeout)
      cleanup()
      if (ws) {
        ws.onclose = null
        ws.onerror = null
        ws.onmessage = null
        ws.onopen = null
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          try { ws.close() } catch { /* ignore */ }
        }
      }
    }
  }, [discordUserId])

  return data
}
