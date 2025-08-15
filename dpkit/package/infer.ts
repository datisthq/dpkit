import type { Package, Resource } from "@dpkit/core"
import { inferResource } from "../resource/index.ts"

// TODO: Move PartialPackage/Resource to @dpkit/core?

interface PartialPackage extends Omit<Package, "resources"> {
  resources: Partial<Resource>[]
}

export async function inferPackage(dataPackage: PartialPackage) {
  const result = {
    ...dataPackage,
    resources: await Promise.all(
      dataPackage.resources.map(async resource => {
        return await inferResource(resource)
      }),
    ),
  }

  return result
}
