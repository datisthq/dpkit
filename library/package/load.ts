import { system } from "../system.ts"

export async function loadPackage(source: string) {
  for (const plugin of system.plugins) {
    const result = await plugin.loadPackage?.(source)
    if (result) return result
  }

  throw new Error(`No plugin can load the package: ${source}`)
}
