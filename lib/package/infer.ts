import type { Package, Resource } from "@dpkit/core"
import type { InferDialectOptions } from "@dpkit/table"
import type { InferSchemaOptions } from "@dpkit/table"
import { inferResource } from "../resource/index.ts"

// TODO: Move PartialPackage/Resource to @dpkit/core?

interface PartialPackage extends Omit<Package, "resources"> {
  resources: Partial<Resource>[]
}

export async function inferPackage(
  dataPackage: PartialPackage,
  options?: InferDialectOptions & InferSchemaOptions,
) {
  const result = {
    ...dataPackage,
    resources: await Promise.all(
      dataPackage.resources.map(async resource => {
        return await inferResource(resource, options)
      }),
    ),
  }

  return result
}
