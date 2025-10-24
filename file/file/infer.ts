import { stat } from "node:fs/promises"
import chardet from "chardet"
import * as hasha from "hasha"
import { isBinaryFile } from "isbinaryfile"
import pMap from "p-map"
import { concatFileStreams } from "../stream/concat.ts"
import { loadFileStream } from "../stream/index.ts"
import { prefetchFiles } from "./fetch.ts"
import { loadFile } from "./load.ts"

export type HashType = "md5" | "sha1" | "sha256" | "sha512"

export async function inferFileBytes(path: string | string[]) {
  const localPaths = await prefetchFiles(path)

  let bytes = 0
  for (const localPath of localPaths) {
    const result = await stat(localPath)
    bytes += result.size
  }

  return bytes
}

export async function inferFileHash(
  path: string | string[],
  options?: { hashType?: HashType },
) {
  const algorithm = options?.hashType ?? "sha256"
  const localPaths = await prefetchFiles(path)

  const streams = await pMap(localPaths, async path => loadFileStream(path))
  const stream = concatFileStreams(streams)

  const hash = await hasha.hash(stream, { algorithm })
  return `${algorithm}:${hash}`
}

export async function inferFileEncoding(
  path: string | string[],
  options?: { sampleBytes?: number; confidencePercent?: number },
) {
  const maxBytes = options?.sampleBytes ?? 10_000
  const confidencePercent = options?.confidencePercent ?? 75

  const firstPath = Array.isArray(path) ? path[0] : path
  if (!firstPath) return undefined

  const buffer = await loadFile(firstPath, { maxBytes })
  const isBinary = await isBinaryFile(buffer)

  if (!isBinary) {
    const matches = chardet.analyse(buffer)
    for (const match of matches) {
      if (match.confidence >= confidencePercent) {
        return match.name.toLowerCase()
      }
    }
  }

  return undefined
}
