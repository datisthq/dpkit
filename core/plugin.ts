import type { LazyDataFrame } from "nodejs-polars"
import type { Package } from "./package/index.js"
import type { Resource } from "./resource/index.js"

export interface Plugin {
  loadPackage?(
    source: string,
  ): Promise<
    undefined | { dataPackage: Package; cleanup?: () => Promise<void> }
  >

  savePackage?(
    dataPackage: Package,
    options: {
      target: string
      withRemote?: boolean
    },
  ): Promise<undefined | { path?: string }>

  readTable?(resource: Resource): Promise<LazyDataFrame | undefined>
}
