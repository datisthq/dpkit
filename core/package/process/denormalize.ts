import type { Descriptor } from "../../general/index.js"
import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function denormalizePackage(props: {
  datapack: Package
  basepath?: string
}) {
  const { basepath } = props
  const datapack = globalThis.structuredClone(props.datapack)

  const resources = datapack.resources.map((resource: any) =>
    denormalizeResource({ resource, basepath }),
  )

  return { ...datapack, resources } as Descriptor
}
