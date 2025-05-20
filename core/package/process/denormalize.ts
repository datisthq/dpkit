import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function denormalizePackage(props: {
  datapack: Package
  basepath?: string
}) {
  const { basepath } = props
  const datapack = globalThis.structuredClone(props.datapack)

  denormalizeResources({ datapack, basepath })

  return datapack
}

function denormalizeResources(props: { datapack: Package; basepath?: string }) {
  const { datapack, basepath } = props

  datapack.resources = datapack.resources.map((resource: any) =>
    denormalizeResource({ resource, basepath }),
  )
}
