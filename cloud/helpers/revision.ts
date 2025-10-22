export function getRevisionCacheControl() {
  return import.meta.env.PROD
    ? `public, max-age=${getRevisionMaxAge()}`
    : "private"
}

export function getRevisionMaxAge() {
  return Math.floor(getRevisionStaleTime() / 1000) // Convert milliseconds to seconds
}

export function getRevisionStaleTime() {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setMinutes(0, 0, 0) // Reset minutes, seconds, and ms
  nextHour.setHours(now.getHours() + 1) // Set to the next hour
  return nextHour.getTime() - now.getTime()
}
