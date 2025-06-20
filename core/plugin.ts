import type { Package } from "./package/index.js"

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
}
