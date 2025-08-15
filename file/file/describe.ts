import { stat } from "node:fs/promises"
import { hashFile } from "hasha"
import { prefetchFile } from "./fetch.ts"

type HashType = "md5" | "sha1" | "sha256" | "sha512"

export async function describeFile(
  path: string,
  options: { hashType: HashType },
) {
  const algorithm = options.hashType
  const localPath = await prefetchFile(path)

  const bytes = (await stat(localPath)).size
  const hash = await hashFile(localPath, { algorithm })

  return { bytes, hash }
}
