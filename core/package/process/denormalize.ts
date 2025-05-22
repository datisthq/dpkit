import type { Descriptor } from "../../general/index.js"
import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function denormalizePackage(props: {
  datapackage: Package
  basepath?: string
}) {
  const { basepath } = props
  const datapackage = globalThis.structuredClone(props.datapackage)

  const resources = datapackage.resources.map((resource: any) =>
    denormalizeResource({ resource, basepath }),
  )

  return { ...datapackage, resources } as Descriptor
}
