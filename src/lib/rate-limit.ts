const attemptStore = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of attemptStore) {
    if (now >= entry.resetAt) attemptStore.delete(key)
  }
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup()
  const now = Date.now()
  const entry = attemptStore.get(key)
  if (!entry || now >= entry.resetAt) {
    attemptStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }
  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count++
  return { allowed: true, remaining: maxAttempts - entry.count, resetAt: entry.resetAt }
}
