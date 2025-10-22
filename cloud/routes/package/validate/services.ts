import * as dpkit from "@dpkit/lib"

export async function validatePackage(
  source: Parameters<typeof dpkit.validatePackage>[0],
) {
  const result = await dpkit.validatePackage(source)
  return result
}
