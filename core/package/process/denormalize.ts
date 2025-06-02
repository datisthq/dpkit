import type { Descriptor } from "../../general/index.js"
import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function denormalizePackage(props: {
  dataPackage: Package
  basepath?: string
}) {
  const { basepath } = props
  const dataPackage = globalThis.structuredClone(props.dataPackage)

  const resources = dataPackage.resources.map((resource: any) =>
    denormalizeResource({ resource, basepath }),
  )

  return { ...dataPackage, resources } as Descriptor
}
