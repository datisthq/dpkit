#!cli/node_modules/.bin/tsx

process.removeAllListeners("warning")
process.on("warning", warning => {
  if (warning.name === "ExperimentalWarning") {
    return
  }
  console.warn(warning)
})

await import("../main.ts")
