import pMap from "p-map"
import { denormalizePath } from "../../descriptor/index.js"
import type { Resource } from "../Resource.js"
import { isTableResource } from "../types/table.js"

type ProcessProps = {
  resource: Resource
  basepath: string
}

export async function processResourceOnSave(props: ProcessProps) {
  denormalizePaths(props)
}

async function denormalizePaths(props: ProcessProps) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? await pMap(resource.path, path => denormalizePath({ path, basepath }))
      : await denormalizePath({ path: resource.path, basepath })
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      if (typeof resource[name] === "string") {
        resource[name] = await denormalizePath({
          path: resource[name],
          basepath,
        })
      }
    }
  }
}
