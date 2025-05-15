import { loadDescriptor } from "../descriptor/load.js"
import type { Package } from "./Package.js"

export async function loadPackage(props: { path: string }) {
  const descriptor = await loadDescriptor(props)
  // TODO: validate descriptor against schema
  return descriptor as Package
}
