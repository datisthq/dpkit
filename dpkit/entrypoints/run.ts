#!/usr/bin/env node

process.removeAllListeners("warning")
process.on("warning", warning => {
  if (warning.name === "ExperimentalWarning") {
    return
  }
  console.warn(warning)
})

await import("../main.ts")
