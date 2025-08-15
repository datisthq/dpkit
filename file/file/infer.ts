import { stat } from "node:fs/promises"
import chardet from "chardet"
import { hashFile } from "hasha"
import { isBinaryFile } from "isbinaryfile"
import { prefetchFile } from "./fetch.ts"
import { loadFile } from "./load.ts"

export type HashType = "md5" | "sha1" | "sha256" | "sha512"

export async function inferFileHash(
  path: string,
  options?: { hashType?: HashType },
) {
  const localPath = await prefetchFile(path)
  const algorithm = options?.hashType ?? "sha256"

  const result = await hashFile(localPath, { algorithm })
  return `${algorithm}:${result}`
}

export async function inferFileBytes(path: string) {
  const localPath = await prefetchFile(path)

  const result = await stat(localPath)
  return result.size
}

export async function inferFileEncoding(
  path: string,
  options?: { sampleBytes?: number; confidencePercent?: number },
) {
  const maxBytes = options?.sampleBytes ?? 10_000
  const confidencePercent = options?.confidencePercent ?? 75

  const buffer = await loadFile(path, { maxBytes })
  const isBinary = await isBinaryFile(buffer)

  if (!isBinary) {
    const matches = chardet.analyse(buffer)
    console.log(matches)
    for (const match of matches) {
      if (match.confidence >= confidencePercent) {
        return match.name.toLowerCase()
      }
    }
  }

  return undefined
}
