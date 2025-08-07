import { Buffer } from "node:buffer"

export function encodeJsonBuffer(data: any, options: { isLines: boolean }) {
  const string = options.isLines
    ? data.map((line: any) => JSON.stringify(line)).join("\n")
    : JSON.stringify(data, null, 2)

  return Buffer.from(string)
}
