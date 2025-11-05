import type { Package } from "./package/index.ts"

export type SavePackageOptions = {
  target: string
  withRemote?: boolean
}

export interface Plugin {
  // TODO: move to @dpkit/dataset?
  loadPackage?(source: string): Promise<Package | undefined>

  // TODO: move to @dpkit/dataset?
  savePackage?(
    dataPackage: Package,
    options: SavePackageOptions,
  ): Promise<{ path?: string } | undefined>
}
