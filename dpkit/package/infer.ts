import type { Package } from "@dpkit/core"
import { inferResource } from "../resource/index.ts"

export async function inferPackage(dataPackage: Package) {
  const result = { ...dataPackage }

  result.resources = await Promise.all(
    dataPackage.resources.map(async resource => {
      return await inferResource(resource)
    }),
  )

  return result
}
