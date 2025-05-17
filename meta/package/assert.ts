import { AssertionError, type Descriptor } from "../descriptor/index.js"
import { validatePackageDescriptor } from "./validate.js"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { errors, datapack } = await validatePackageDescriptor(props)

  if (!datapack) {
    throw new AssertionError(errors)
  }

  return datapack
}
