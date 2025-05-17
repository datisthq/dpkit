import pMap from "p-map"
import { normalizePath } from "../../descriptor/index.js"
import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
  basepath?: string
}

export async function processResourceOnLoad(props: ProcessProps) {
  normalizePaths(props)
}

async function normalizePaths(props: ProcessProps) {
  const { descriptor, basepath } = props

  if (descriptor.path) {
    if (!basepath) throw new Error("Basepath is required")
    descriptor.path = Array.isArray(descriptor.path)
      ? await pMap(descriptor.path, path => normalizePath({ path, basepath }))
      : await normalizePath({ path: descriptor.path, basepath })
  }

  if (typeof descriptor.path === "string") {
    if (!basepath) throw new Error("Basepath is required")
    descriptor.path = await normalizePath({ path: descriptor.path, basepath })
  }

  if (Array.isArray(descriptor.path)) {
    for (const [index, path] of descriptor.path.entries()) {
      if (!basepath) throw new Error("Basepath is required")
      descriptor.path[index] = await normalizePath({ path, basepath })
    }
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof descriptor[name] === "string") {
      if (!basepath) throw new Error("Basepath is required")
      descriptor[name] = await normalizePath({
        path: descriptor[name],
        basepath,
      })
    }
  }
}
