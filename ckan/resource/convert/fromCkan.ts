import type { Resource } from "@dpkit/core"
import { getFilename } from "@dpkit/core"
import { convertSchemaFromCkan } from "../../schema/index.ts"
import type { CkanResource } from "../Resource.ts"

export function convertResourceFromCkan(ckanResource: CkanResource): Resource {
  const resource: Resource = {
    name: convertName(ckanResource.name),
    path: ckanResource.url,
    "ckan:key": getFilename(ckanResource.url),
    "ckan:url": ckanResource.url,
  }

  if (ckanResource.description) {
    resource.description = ckanResource.description
  }

  if (ckanResource.format) {
    resource.format = ckanResource.format.toLowerCase()
  }

  if (ckanResource.mimetype) {
    resource.mediatype = ckanResource.mimetype
  }

  if (ckanResource.size) {
    resource.bytes = ckanResource.size
  }

  if (ckanResource.hash) {
    resource.hash = ckanResource.hash
  }

  if (ckanResource.schema) {
    resource.type = "table"
    resource.schema = convertSchemaFromCkan(ckanResource.schema)
  }

  return resource
}

function convertName(name: string): string {
  return (
    name
      .replace(/[\s\.\(\)\/\\,]+/g, "_")
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .replace(/^(\d)/, "_$1")
      .slice(0, 100)
  )
}
