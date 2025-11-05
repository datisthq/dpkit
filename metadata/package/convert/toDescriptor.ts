import type { Descriptor } from "../../descriptor/index.ts"
import { convertResourceToDescriptor } from "../../resource/index.ts"
import type { Package } from "../Package.ts"

export function convertPackageToDescriptor(
  dataPackage: Package,
  options?: {
    basepath?: string
  },
) {
  dataPackage = globalThis.structuredClone(dataPackage)

  const resources = dataPackage.resources.map((resource: any) =>
    convertResourceToDescriptor(resource, { basepath: options?.basepath }),
  )

  return { ...dataPackage, resources } as Descriptor
}
