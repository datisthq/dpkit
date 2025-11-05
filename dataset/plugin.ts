import type { Plugin } from "@dpkit/metadata"
import type { Package } from "@dpkit/metadata"

export type SavePackageOptions = {
  target: string
  withRemote?: boolean
}

export interface DatasetPlugin extends Plugin {
  loadPackage?(source: string): Promise<Package | undefined>

  savePackage?(
    dataPackage: Package,
    options: SavePackageOptions,
  ): Promise<{ path?: string } | undefined>
}
