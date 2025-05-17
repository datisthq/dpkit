import { normalizePath } from "../../descriptor/index.js"
import type { Descriptor } from "../../descriptor/index.js"

type ProcessProps = {
  descriptor: Descriptor
  basepath?: string
}

export function processResourceOnLoad(props: ProcessProps) {
  normalizePaths(props)
}

function normalizePaths(props: ProcessProps) {
  const { descriptor, basepath } = props

  if (typeof descriptor.path === "string") {
    descriptor.path = normalizePath({ path: descriptor.path, basepath })
  }

  if (Array.isArray(descriptor.path)) {
    for (const [index, path] of descriptor.path.entries()) {
      descriptor.path[index] = normalizePath({ path, basepath })
    }
  }

  for (const name of ["dialect", "schema"] as const) {
    if (typeof descriptor[name] === "string") {
      descriptor[name] = normalizePath({
        path: descriptor[name],
        basepath,
      })
    }
  }
}
