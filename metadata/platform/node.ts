export const node = await loadNodeApis()

async function loadNodeApis() {
  if (globalThis.process) {
    const fs = await import("node:fs/promises")
    const path = await import("node:path")
    return { fs, path }
  }

  return undefined
}
