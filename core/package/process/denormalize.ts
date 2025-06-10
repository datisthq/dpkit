import type { Descriptor } from "../../general/index.js"
import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

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
