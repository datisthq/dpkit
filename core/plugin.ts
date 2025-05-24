import type { Descriptor } from "./general/index.js"
import type { Package } from "./package/index.js"

export interface Plugin {
  loadPackage?: (props: {
    source: string
    options?: Descriptor
  }) => Promise<
    undefined | { datapackage: Package; cleanup?: () => Promise<void> }
  >

  savePackage?: (props: {
    datapackage: Package
    target: string
    options?: Descriptor
  }) => Promise<undefined | { path?: string }>
}
