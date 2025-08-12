import type { Descriptor } from "../../general/index.ts"
import { denormalizeResource } from "../../resource/index.ts"
import type { Package } from "../Package.ts"

export function denormalizePackage(
  dataPackage: Package,
  options?: {
    basepath?: string
  },
) {
  dataPackage = globalThis.structuredClone(dataPackage)

  const resources = dataPackage.resources.map((resource: any) =>
    denormalizeResource(resource, { basepath: options?.basepath }),
  )

  return { ...dataPackage, resources } as Descriptor
}
