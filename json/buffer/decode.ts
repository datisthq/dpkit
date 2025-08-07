import type { Buffer } from "node:buffer"

export function decodeJsonBuffer(
  buffer: Buffer,
  options: { isLines: boolean },
) {
  const string = buffer.toString("utf-8")

  return options.isLines
    ? string
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line))
    : JSON.parse(string)
}
