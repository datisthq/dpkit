import { AssertionError, type Descriptor } from "../general/index.js"
import { validatePackageDescriptor } from "./validate.js"

/**
 * Assert a Package descriptor (JSON Object) against its profile
 */
export async function assertPackage(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { errors, datapackage } = await validatePackageDescriptor(props)
  if (!datapackage) throw new AssertionError(errors)
  return datapackage
}
