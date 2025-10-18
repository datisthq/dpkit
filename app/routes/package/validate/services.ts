import * as dpkit from "@dpkit/lib"

export async function validatePackage(source: string) {
  const result = await dpkit.validatePackage(source)
  return result
}
