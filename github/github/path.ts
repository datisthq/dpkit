export function normalizeFileLink(link: string) {
  return link.replace("/api/", "/").replace(/\/content$/, "")
}
