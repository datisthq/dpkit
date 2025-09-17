import type { Package } from "./package/index.ts"

export type SavePackageOptions = {
  target: string
  withRemote?: boolean
}

export interface Plugin {
  loadPackage?(source: string): Promise<Package | undefined>

  savePackage?(
    dataPackage: Package,
    options: SavePackageOptions,
  ): Promise<{ path?: string } | undefined>
}
