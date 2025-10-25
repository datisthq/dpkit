export function detectPlatform() {
  if (typeof navigator === "undefined") return "other"
  const userAgent = navigator.userAgent.toLowerCase()
  if (
    userAgent.includes("mac") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipad")
  ) {
    return "ios"
  }
  return "other"
}
