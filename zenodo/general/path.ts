export function normalizeFileLink(props: { link: string }) {
  return props.link.replace("/api/", "/").replace(/\/content$/, "")
}
