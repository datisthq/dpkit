import type { Package } from "./package/index.js"

export interface Plugin {
  loadPackage?(source: string): Promise<Package | undefined>

  savePackage?(
    dataPackage: Package,
    options: {
      target: string
      withRemote?: boolean
    },
  ): Promise<undefined | { path?: string }>
}
