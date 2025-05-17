import { denormalizePath } from "../../descriptor/index.js"
import type { Resource } from "../Resource.js"
import { isTableResource } from "../types/table.js"

type ProcessProps = {
  resource: Resource
  basepath: string
}

export function processResourceOnSave(props: ProcessProps) {
  denormalizePaths(props)
}

function denormalizePaths(props: ProcessProps) {
  const { resource, basepath } = props

  if (resource.path) {
    resource.path = Array.isArray(resource.path)
      ? resource.path.map(path => denormalizePath({ path, basepath }))
      : denormalizePath({ path: resource.path, basepath })
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      if (typeof resource[name] === "string") {
        resource[name] = denormalizePath({
          path: resource[name],
          basepath,
        })
      }
    }
  }
}
